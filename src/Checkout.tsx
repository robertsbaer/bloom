import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Minimal shape of the Square Web SDK we use. The full SDK has no official types.
interface SquareCard {
  attach: (el: HTMLElement) => Promise<void>;
  destroy?: () => void;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message?: string; field?: string }>;
  }>;
}
interface SquarePayments {
  card: (opts?: Record<string, unknown>) => Promise<SquareCard>;
  verifyBuyer: (token: string, details: any) => Promise<{ token?: string } | null>;
}
interface SquareGlobal {
  payments: (appId: string, locationId: string) => SquarePayments;
}

declare global {
  interface Window {
    Square?: SquareGlobal;
  }
}

interface CartItem {
  id: string;
  productId: number;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  sizeLabel: string;
  image: string;
  quantity: number;
}

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onSuccess: (result: { orderId: string; receiptUrl: string | null }) => void;
}

interface AddressForm {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

const emptyAddr: AddressForm = {
  name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "US",
};

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all focus:border-[#1e3a20]";
const inputStyle = {
  backgroundColor: "#f5f0e8",
  border: "1.5px solid #e0d8cc",
  color: "#1e2d1f",
};
const labelCls = "block text-xs font-sans mb-1.5";
const labelStyle = { color: "#6b5c45", letterSpacing: "0.05em" };

const SQUARE_SDK_URL =
  (import.meta.env.VITE_SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase() ===
  "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

function loadSquareSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve();
    const existing = document.querySelector(`script[src="${SQUARE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Square SDK")),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = SQUARE_SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Square SDK"));
    document.head.appendChild(s);
  });
}

export default function Checkout({
  open,
  onClose,
  cartItems,
  cartTotal,
  onSuccess,
}: CheckoutProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState<AddressForm>(emptyAddr);
  const [billing, setBilling] = useState<AddressForm>(emptyAddr);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [discountInfo, setDiscountInfo] = useState<{
    isFirstPurchase: boolean;
    discountCents: number;
    totalCents: number;
  } | null>(null);

  const [successInfo, setSuccessInfo] = useState<{
    orderId: string;
    receiptUrl: string | null;
  } | null>(null);

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<SquareCard | null>(null);
  const paymentsRef = useRef<SquarePayments | null>(null);
  const [cardReady, setCardReady] = useState(false);

  // ── Reset on open/close ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setStep("info");
      setErrorMsg(null);
      setDiscountInfo(null);
      setSuccessInfo(null);
      setCardReady(false);
      if (cardInstanceRef.current?.destroy) {
        cardInstanceRef.current.destroy();
        cardInstanceRef.current = null;
      }
    }
  }, [open]);

  // ── Mount Square card form when entering payment step ───────────────
  useEffect(() => {
    if (step !== "payment") return;
    let canceled = false;

    (async () => {
      try {
        await loadSquareSdk();
        if (canceled) return;
        const appId = import.meta.env.VITE_SQUARE_APP_ID as string | undefined;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID as
          | string
          | undefined;
        if (!appId || !locationId) {
          setErrorMsg(
            "Payment form is not configured. Please add VITE_SQUARE_APP_ID and VITE_SQUARE_LOCATION_ID.",
          );
          return;
        }
        const payments = window.Square!.payments(appId, locationId);
        paymentsRef.current = payments;
        const card = await payments.card({
          style: {
            input: {
              fontSize: "16px",
              color: "#1e2d1f",
              fontFamily: "inherit",
            },
            ".input-container": {
              borderRadius: "12px",
              borderColor: "#e0d8cc",
            },
            ".input-container.is-focus": { borderColor: "#1e3a20" },
            ".input-container.is-error": { borderColor: "#b3261e" },
          },
        });
        if (canceled) {
          card.destroy?.();
          return;
        }
        await card.attach(cardContainerRef.current!);
        cardInstanceRef.current = card;
        setCardReady(true);
      } catch (err: unknown) {
        if (!canceled)
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Could not initialize payment form",
          );
      }
    })();

    return () => {
      canceled = true;
    };
  }, [step]);

  // ── Validation for the info step ────────────────────────────────────
  function validateInfo(): string | null {
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return "Please enter a valid email address.";
    const required: (keyof AddressForm)[] = [
      "name",
      "address1",
      "city",
      "state",
      "postalCode",
    ];
    for (const k of required) {
      if (!shipping[k].trim())
        return `Shipping ${k.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`;
    }
    if (!billingSameAsShipping) {
      for (const k of required) {
        if (!billing[k].trim())
          return `Billing ${k.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`;
      }
    }
    return null;
  }

  function continueToPayment() {
    const err = validateInfo();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setStep("payment");
  }

  // ── Submit payment ──────────────────────────────────────────────────
  async function handlePay() {
    if (!cardInstanceRef.current || !paymentsRef.current) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Tokenize
      console.log("[DIAGNOSTIC] Step 1: Calling card.tokenize()...");
      const result = await cardInstanceRef.current.tokenize();
      console.log("[DIAGNOSTIC] card.tokenize() full result:", {
        status: result.status,
        hasToken: !!result.token,
        errors: result.errors,
      });

      if (result.status !== "OK" || !result.token) {
        console.error("[DIAGNOSTIC] card.tokenize() FAILED.");
        const msg = result.errors?.[0]?.message ?? "Card details are invalid.";
        setErrorMsg(msg);
        setSubmitting(false);
        return;
      }
      console.log("[DIAGNOSTIC] Step 1: card.tokenize() SUCCEEDED.");

      // 2. Verify Buyer
      let verificationResult: { token?: string } | null = null;
      try {
        const verificationDetails = {
          amount: (cartTotal * 100).toFixed(0), // Amount in cents as a string
          currencyCode: "USD", // Added missing currencyCode
          intent: "CHARGE" as const,
          billingContact: {
            familyName: (billingSameAsShipping ? shipping : billing).name
              .split(" ")
              .slice(-1)[0],
            givenName: (billingSameAsShipping ? shipping : billing).name
              .split(" ")
              .slice(0, -1)
              .join(" "),
            email: email,
            countryCode: (billingSameAsShipping ? shipping : billing).countryCode || "US", // Changed to countryCode
            city: (billingSameAsShipping ? shipping : billing).city,
            addressLines: [
              (billingSameAsShipping ? shipping : billing).address1,
              (billingSameAsShipping ? shipping : billing).address2,
            ],
            postalCode: (billingSameAsShipping ? shipping : billing).postalCode,
            phone: phone || undefined,
          },
        };

        console.log(
          "[DIAGNOSTIC] Step 2: Calling payments.verifyBuyer() with details:",
          {
            amount: verificationDetails.amount,
            intent: verificationDetails.intent,
            billingContact: {
              familyName: !!verificationDetails.billingContact.familyName,
              givenName: !!verificationDetails.billingContact.givenName,
              email: !!verificationDetails.billingContact.email,
              countryCode: !!verificationDetails.billingContact.countryCode,
              city: !!verificationDetails.billingContact.city,
              addressLines: !!verificationDetails.billingContact.addressLines,
              postalCode: !!verificationDetails.billingContact.postalCode,
            },
          },
        );

        verificationResult = await paymentsRef.current.verifyBuyer(
          result.token,
          verificationDetails,
        );

        console.log("[DIAGNOSTIC] payments.verifyBuyer() SUCCEEDED. Result:", {
          hasToken: !!verificationResult?.token,
        });
      } catch (error) {
        console.error("[DIAGNOSTIC] Step 2: payments.verifyBuyer() FAILED.", error);
        setErrorMsg(
          error instanceof Error ? error.message : "Buyer verification failed.",
        );
        setSubmitting(false);
        return;
      }

      // 3. Process Payment
      console.log("[DIAGNOSTIC] Step 3: Calling process-payment function...");
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      const billingPayload = billingSameAsShipping ? shipping : billing;
      const idempotencyKey = crypto.randomUUID();

      const res = await fetch(`${supabaseUrl}/functions/v1/process-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnon}`,
          apikey: supabaseAnon,
        },
        body: JSON.stringify({
          sourceId: result.token,
          verificationToken: verificationResult?.token,
          idempotencyKey,
          email,
          phone: phone || undefined,
          shipping,
          billing: billingPayload,
          items: cartItems.map((i) => ({
            productId: i.productId,
            sizeLabel: i.sizeLabel,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      console.log("[DIAGNOSTIC] Step 3: process-payment response:", {
        ok: res.ok,
        status: res.status,
        data,
      });

      if (!res.ok) {
        setErrorMsg(data?.error ?? "Payment failed. Please try again.");
        setSubmitting(false);
        return;
      }

      // 4. Handle Success
      console.log("[DIAGNOSTIC] Step 4: Handling success...");
      setDiscountInfo({
        isFirstPurchase: !!data.isFirstPurchase,
        discountCents: data.discountCents ?? 0,
        totalCents: data.totalCents ?? 0,
      });
      setSuccessInfo({
        orderId: data.orderId,
        receiptUrl: data.receiptUrl ?? null,
      });

      if (data.newUser) {
        sessionStorage.setItem("pendingOrderId", data.orderId);
        navigate(`/create-account?email=${encodeURIComponent(email)}`);
      } else {
        setStep("success");
        onSuccess({
          orderId: data.orderId,
          receiptUrl: data.receiptUrl ?? null,
        });
      }
    } catch (err: unknown) {
      console.error("[DIAGNOSTIC] An unexpected error occurred in handlePay:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60]"
        style={{ backgroundColor: "rgba(20,30,20,0.55)" }}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-[61] flex items-start sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="w-full sm:max-w-2xl rounded-none sm:rounded-3xl shadow-2xl my-0 sm:my-8 relative"
          style={{ backgroundColor: "#fbf8f1", border: "1px solid #ede7db" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5 border-b sticky top-0 z-10 rounded-t-3xl"
            style={{ borderColor: "#ede7db", backgroundColor: "#fbf8f1" }}
          >
            <div className="flex items-center gap-3">
              <Lock size={16} style={{ color: "#1e3a20" }} />
              <h2 className="text-lg font-serif" style={{ color: "#1e3a20" }}>
                {step === "success" ? "Order Confirmed" : "Secure Checkout"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "#6b5c45" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0e8d8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Order summary chip */}
            {step !== "success" && (
              <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#f5f0e8",
                  border: "1px solid #e8e0d0",
                }}
              >
                <div>
                  <p
                    className="text-xs font-sans"
                    style={{ color: "#9c8870", letterSpacing: "0.08em" }}
                  >
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} ITEM
                    {cartItems.reduce((s, i) => s + i.quantity, 0) !== 1
                      ? "S"
                      : ""}
                  </p>
                  <p
                    className="text-sm font-sans mt-0.5"
                    style={{ color: "#1e3a20" }}
                  >
                    Subtotal
                  </p>
                </div>
                <p className="text-lg font-serif" style={{ color: "#1e3a20" }}>
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
            )}

            {/* Error */}
            {errorMsg && (
              <div
                className="flex items-start gap-2 rounded-xl p-3.5 text-sm"
                style={{
                  backgroundColor: "#fdecec",
                  border: "1px solid #f5c5c5",
                  color: "#8c1e1e",
                }}
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span className="font-sans">{errorMsg}</span>
              </div>
            )}

            {/* ─── Info step ───────────────────────────────────────── */}
            {step === "info" && (
              <>
                <Section title="Contact">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Email" required>
                      <input
                        type="email"
                        className={inputCls}
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        type="tel"
                        className={inputCls}
                        style={inputStyle}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 555-5555"
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="Shipping Address">
                  <AddressFields value={shipping} onChange={setShipping} />
                </Section>

                <Section title="Billing Address">
                  <label
                    className="flex items-center gap-2 text-sm cursor-pointer mb-3"
                    style={{ color: "#1e3a20" }}
                  >
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) =>
                        setBillingSameAsShipping(e.target.checked)
                      }
                      className="w-4 h-4"
                      style={{ accentColor: "#1e3a20" }}
                    />
                    <span className="font-sans">Same as shipping address</span>
                  </label>
                  {!billingSameAsShipping && (
                    <AddressFields value={billing} onChange={setBilling} />
                  )}
                </Section>

                <button
                  onClick={continueToPayment}
                  className="w-full py-3.5 rounded-full text-sm font-sans transition-all duration-200"
                  style={{
                    backgroundColor: "#1e3a20",
                    color: "#fff",
                    letterSpacing: "0.08em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#a07840")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e3a20")
                  }
                >
                  Continue to Payment
                </button>
              </>
            )}

            {/* ─── Payment step ────────────────────────────────────── */}
            {step === "payment" && (
              <>
                <Section title="Payment">
                  <p
                    className="text-xs font-sans mb-3"
                    style={{ color: "#9c8870" }}
                  >
                    Your card details are securely tokenized by Square. We never
                    see or store them.
                  </p>
                  <div
                    ref={cardContainerRef}
                    className="rounded-xl p-1"
                    style={{
                      minHeight: 90,
                      backgroundColor: "#f5f0e8",
                      border: "1.5px solid #e0d8cc",
                    }}
                  />
                  {!cardReady && (
                    <p
                      className="text-xs font-sans mt-3 flex items-center gap-2"
                      style={{ color: "#9c8870" }}
                    >
                      <Loader2 size={12} className="animate-spin" /> Loading
                      secure form…
                    </p>
                  )}
                </Section>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("info")}
                    className="flex-1 py-3.5 rounded-full text-sm font-sans transition-all"
                    style={{
                      backgroundColor: "transparent",
                      color: "#1e3a20",
                      border: "1.5px solid #1e3a20",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={!cardReady || submitting}
                    className="flex-[2] py-3.5 rounded-full text-sm font-sans transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor:
                        !cardReady || submitting ? "#a3a89c" : "#1e3a20",
                      color: "#fff",
                      letterSpacing: "0.08em",
                      cursor:
                        !cardReady || submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Processing…
                      </>
                    ) : (
                      <>Pay ${cartTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
                <p
                  className="text-[11px] font-sans text-center"
                  style={{ color: "#9c8870" }}
                >
                  First-time customers automatically receive 10% off at
                  checkout.
                </p>
              </>
            )}

            {/* ─── Success step ───────────────────────────────────── */}
            {step === "success" && successInfo && (
              <div className="text-center py-6 space-y-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "#e3f2dc" }}
                >
                  <CheckCircle2 size={32} style={{ color: "#1e3a20" }} />
                </div>
                <div>
                  <h3
                    className="font-serif text-2xl mb-2"
                    style={{ color: "#1e3a20" }}
                  >
                    Thank you for your order
                  </h3>
                  <p className="text-sm font-sans" style={{ color: "#6b5c45" }}>
                    A confirmation has been sent to <strong>{email}</strong>.
                  </p>
                </div>

                {discountInfo?.isFirstPurchase &&
                  discountInfo.discountCents > 0 && (
                    <div
                      className="rounded-2xl p-4 text-sm"
                      style={{
                        backgroundColor: "#f5edd8",
                        border: "1px solid #e8d8a8",
                        color: "#7a5c1e",
                      }}
                    >
                      <strong>Welcome gift applied —</strong> 10% off your first
                      order (saved $
                      {(discountInfo.discountCents / 100).toFixed(2)}).
                    </div>
                  )}

                <div className="text-xs font-sans" style={{ color: "#9c8870" }}>
                  Order #{successInfo.orderId.slice(0, 8).toUpperCase()}
                </div>

                {successInfo.receiptUrl && (
                  <a
                    href={successInfo.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block underline text-sm font-sans"
                    style={{ color: "#1e3a20" }}
                  >
                    View receipt
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-full text-sm font-sans transition-all"
                  style={{
                    backgroundColor: "#1e3a20",
                    color: "#fff",
                    letterSpacing: "0.08em",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        className="text-[11px] font-sans mb-3 uppercase"
        style={{ color: "#9c8870", letterSpacing: "0.12em" }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls} style={labelStyle}>
        {label}
        {required && <span style={{ color: "#a07840" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function AddressFields({
  value,
  onChange,
}: {
  value: AddressForm;
  onChange: (next: AddressForm) => void;
}) {
  const set =
    (k: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [k]: e.target.value });

  return (
    <div className="space-y-3">
      <Field label="Full name" required>
        <input
          className={inputCls}
          style={inputStyle}
          value={value.name}
          onChange={set("name")}
        />
      </Field>
      <Field label="Address line 1" required>
        <input
          className={inputCls}
          style={inputStyle}
          value={value.address1}
          onChange={set("address1")}
          placeholder="Street address"
        />
      </Field>
      <Field label="Address line 2">
        <input
          className={inputCls}
          style={inputStyle}
          value={value.address2}
          onChange={set("address2")}
          placeholder="Apt, suite, unit (optional)"
        />
      </Field>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2">
          <Field label="City" required>
            <input
              className={inputCls}
              style={inputStyle}
              value={value.city}
              onChange={set("city")}
            />
          </Field>
        </div>
        <Field label="State" required>
          <input
            className={inputCls}
            style={inputStyle}
            value={value.state}
            onChange={set("state")}
            placeholder="MD"
            maxLength={2}
          />
        </Field>
        <Field label="ZIP" required>
          <input
            className={inputCls}
            style={inputStyle}
            value={value.postalCode}
            onChange={set("postalCode")}
          />
        </Field>
      </div>
    </div>
  );
}
