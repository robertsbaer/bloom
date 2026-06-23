import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Checkout from "./Checkout";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Menu,
  Search,
  ChevronRight,
  Leaf,
} from "lucide-react";
import {
  products,
  categoryColors,
  sectionTabs,
  type Product,
  type SectionTab,
} from "./data";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

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

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all";
const inputStyle = {
  backgroundColor: "#f5f0e8",
  border: "1.5px solid #e0d8cc",
  color: "#1e2d1f",
};

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>(
    {},
  );
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SectionTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalTab, setModalTab] = useState<
    "benefits" | "ingredients" | "howto"
  >("benefits");

  // Contact modal
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);

  // Report a problem modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    productName: "",
    issueDescription: "",
    contactInfo: "",
    other: "",
  });
  const [reportSent, setReportSent] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Email popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupSent, setPopupSent] = useState(false);
  const [popupSubmitting, setPopupSubmitting] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("bloom55_popup_seen");
    if (!seen) {
      const t = setTimeout(() => setPopupOpen(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchesTab = activeTab === "All" || p.section === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cardDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function getSelectedSizeIndex(productId: number) {
    return selectedSizes[productId] ?? 0;
  }

  function addToCart(product: Product, sizeIndex: number) {
    const size = product.sizes[sizeIndex];
    const itemId = `${product.id}-${sizeIndex}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing)
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          shortName: product.shortName,
          tagline: product.tagline,
          price: size.price,
          sizeLabel: size.label,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setAddedId(itemId);
    setTimeout(() => setAddedId(null), 1200);
    setCartOpen(true);
    if (modalProduct) setModalProduct(null);
  }

  function updateQuantity(id: string, delta: number) {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setReportSubmitting(true);
    await supabase.from("product_reports").insert({
      product_name: reportForm.productName,
      issue_description: reportForm.issueDescription,
      contact_info: reportForm.contactInfo || null,
      other: reportForm.other || null,
    });
    setReportSubmitting(false);
    setReportSent(true);
  }

  async function submitPopup(e: React.FormEvent) {
    e.preventDefault();
    setPopupSubmitting(true);
    await supabase
      .from("email_signups")
      .insert({ email: popupEmail, source: "popup_10off" });
    setPopupSubmitting(false);
    setPopupSent(true);
    localStorage.setItem("bloom55_popup_seen", "1");
  }

  function closePopup() {
    setPopupOpen(false);
    localStorage.setItem("bloom55_popup_seen", "1");
  }

  const navLinks = [
    { label: "Shop the Collection", href: "#shop-the-collection" },
    { label: "Story", href: "#story" },
    { label: "Inside the Formula", href: "#inside-the-formula" },
    { label: "Latest Buzz", href: "#latest-buzz" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(250,247,242,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e8e0d0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <img
            src={`${import.meta.env.BASE_URL}bloom__horizontal_color.png`}
            alt="Bloom 5.5"
            className="h-12 w-auto flex-shrink-0"
          />

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
                style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a07840")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5c45")}
              >
                {label}
              </a>
            ))}
            <Link
              to="/wholesale"
              className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
              style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a07840")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5c45")}
            >
              Wholesale
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    placeholder="Search products..."
                    className="text-sm font-sans outline-none px-3 py-1.5 rounded-full"
                    style={{
                      border: "1.5px solid #1e3a20",
                      color: "#1e2d1f",
                      backgroundColor: "#fff",
                      width: "180px",
                    }}
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "#f0ebe1" }}
                  >
                    <X size={13} style={{ color: "#6b5c45" }} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{ backgroundColor: "#f0ebe1" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e8e0d0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0ebe1")
                  }
                >
                  <Search size={16} style={{ color: "#6b5c45" }} />
                </button>
              )}
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 font-sans"
              style={{ backgroundColor: "#1e3a20", color: "#fff" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2d5a27")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e3a20")
              }
            >
              <ShoppingCart size={15} />
              <span
                className="hidden sm:inline text-xs"
                style={{ letterSpacing: "0.06em" }}
              >
                Cart
              </span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#c9a84c", color: "#fff" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={20} style={{ color: "#6b5c45" }} />
              ) : (
                <Menu size={20} style={{ color: "#6b5c45" }} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="lg:hidden px-6 pb-5 flex flex-col gap-4 border-t"
            style={{
              borderColor: "#e8e0d0",
              backgroundColor: "rgba(250,247,242,0.98)",
            }}
          >
            <div
              className="pt-3 flex items-center gap-2 rounded-full px-3 py-2"
              style={{ border: "1px solid #e0d8cc" }}
            >
              <Search size={14} style={{ color: "#9c8870" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="text-sm font-sans outline-none flex-1 bg-transparent"
                style={{ color: "#1e2d1f" }}
              />
            </div>
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm uppercase font-sans"
                style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              to="/wholesale"
              className="text-sm uppercase font-sans"
              style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Wholesale
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="pt-16" style={{ backgroundColor: "#faf7f2" }}>
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
          <div
            className="rounded-2xl overflow-hidden relative flex items-center"
            style={{ backgroundColor: "#1e3a20", minHeight: "300px" }}
          >
            {/* Decorative blobs */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
                transform: "translate(20%, -20%)",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-8 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #8aaa8c 0%, transparent 70%)",
                transform: "translateY(30%)",
              }}
            />

            <div className="relative px-8 md:px-14 py-10 md:py-12 flex flex-col md:flex-row md:items-center gap-8 w-full">
              <div className="flex-1">
                <p
                  className="text-xs tracking-widest uppercase mb-3 font-sans"
                  style={{ color: "#8aaa8c", letterSpacing: "0.22em" }}
                >
                  Clean · Botanical · Balanced
                </p>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl mb-5 leading-tight"
                  style={{ color: "#fff" }}
                >
                  Bloom Beautifully,
                  <br />
                  <span style={{ color: "#c9a84c" }}>
                    Powered by Prickly Pear.
                  </span>
                </h1>
                <p
                  className="font-sans text-sm md:text-base leading-relaxed mb-7 max-w-xl"
                  style={{ color: "#a8c4aa" }}
                >
                  Bloom 5.5 is crafted to support skin's natural pH 5.5 with
                  nature-based formulas designed to work with your body, not
                  against it. Powered by the resilience of the desert cactus and
                  the richness of prickly pear seed oil, our products help leave
                  skin feeling balanced, nourished, and beautifully soft.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#shop-the-collection"
                    className="px-7 py-3 rounded-full text-sm font-sans transition-all duration-200"
                    style={{
                      backgroundColor: "#c9a84c",
                      color: "#1a2b1b",
                      letterSpacing: "0.06em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d4b85a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c9a84c")
                    }
                  >
                    Shop the Collection
                  </a>
                  <a
                    href="#story"
                    className="px-7 py-3 rounded-full text-sm font-sans border transition-all duration-200"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "#e8dcc8",
                      letterSpacing: "0.06em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c9a84c";
                      e.currentTarget.style.color = "#c9a84c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.3)";
                      e.currentTarget.style.color = "#e8dcc8";
                    }}
                  >
                    Story
                  </a>
                  <a
                    href="#inside-the-formula"
                    className="px-7 py-3 rounded-full text-sm font-sans border transition-all duration-200"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "#e8dcc8",
                      letterSpacing: "0.06em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c9a84c";
                      e.currentTarget.style.color = "#c9a84c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.3)";
                      e.currentTarget.style.color = "#e8dcc8";
                    }}
                  >
                    Inside the Formula
                  </a>
                </div>
              </div>

              <div className="flex-shrink-0 hidden md:flex items-center justify-center">
                <div className="relative w-44 h-44 lg:w-56 lg:h-56">
                  <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
                    }}
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`}
                    alt="Bloom 5.5"
                    className="relative w-full h-full object-contain"
                    style={{
                      filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────────────── */}
      <section
        id="story"
        className="py-20"
        style={{ backgroundColor: "#faf7f2" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              Our Story
            </p>
            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{ color: "#1e2d1f", lineHeight: "1.15" }}
            >
              Rooted in nature.
              <br />
              <span style={{ color: "#a07840" }}>Backed by science.</span>
            </h2>
            <p
              className="font-sans text-base leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#6b5c45" }}
            >
              Bloom 5.5 was built on a simple belief: skin deserves better than
              shortcuts. Every formula is crafted to support your skin's natural
              balance, not work against it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}images/products/Desert_Bloom_Body_Butter.png`}
                alt="Small-batch crafted skincare"
                className="rounded-2xl w-full object-cover shadow-xl"
                style={{ height: "460px" }}
              />
              <div
                className="absolute -bottom-5 -left-5 rounded-2xl px-6 py-5"
                style={{ backgroundColor: "#1e3a20", maxWidth: "240px" }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: "#c9a84c", fontSize: "1rem" }}
                >
                  Small-batch crafted.
                </p>
                <p
                  className="text-xs font-sans leading-relaxed"
                  style={{ color: "#8aaa8c" }}
                >
                  Exceptional quality.
                </p>
              </div>
            </div>

            <div>
              <p
                className="text-xs tracking-widest uppercase mb-4 font-sans"
                style={{ color: "#a07840", letterSpacing: "0.2em" }}
              >
                How It Started
              </p>
              <div
                className="space-y-4 font-sans text-base leading-relaxed"
                style={{ color: "#6b5c45" }}
              >
                <p>
                  Bloom 5.5 was founded on the belief that effective skincare
                  should be simple, thoughtful, and made to support skin's
                  natural balance. Every formula is carefully crafted with
                  ingredients that serve a clear purpose and work in harmony
                  with the skin.
                </p>
                <p>
                  Each product is formulated to support the skin's ideal pH of
                  5.5, helping maintain a balanced, comfortable feel. The heart
                  of Bloom 5.5 formulas is cold-pressed Prickly Pear Seed Oil, a
                  prized botanical known for its antioxidant-rich profile,
                  lightweight feel, and ability to help skin look radiant, soft,
                  and healthy.
                </p>
                <p>
                  Small-batch crafted in Edgewater, Maryland to ensure superior
                  quality and preserve the freshness of our formulas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ───────────────────────────────────────────────── */}
      <section
        id="shop-the-collection"
        className="py-20"
        style={{ backgroundColor: "#f5f0e8" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              The Collection
            </p>
            <h2
              className="text-4xl md:text-5xl mb-3"
              style={{ color: "#1e2d1f" }}
            >
              Shop the Collection
            </h2>
            <p
              className="font-sans text-base max-w-xl mx-auto"
              style={{ color: "#6b5c45" }}
            >
              Prickly Pear-powered balance for skin that BLOOMs strong, every
              day.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {sectionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-full text-sm font-sans transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab ? "#1e3a20" : "#fff",
                  color: activeTab === tab ? "#fff" : "#6b5c45",
                  border: "1.5px solid",
                  borderColor: activeTab === tab ? "#1e3a20" : "#e0d8cc",
                  letterSpacing: "0.04em",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Mobile search */}
          <div
            className="md:hidden mb-6 flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ backgroundColor: "#fff", border: "1.5px solid #e0d8cc" }}
          >
            <Search size={14} style={{ color: "#9c8870" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="text-sm font-sans outline-none flex-1 bg-transparent"
              style={{ color: "#1e2d1f" }}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-sans" style={{ color: "#9c8870" }}>
                No products found. Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const sizeIdx = getSelectedSizeIndex(product.id);
                const size = product.sizes[sizeIdx];
                const itemId = `${product.id}-${sizeIdx}`;
                const cat = categoryColors[product.category] ?? {
                  bg: "#1e3a20",
                  text: "#d4edcc",
                };

                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 16px rgba(30,58,32,0.06)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 8px 40px rgba(30,58,32,0.14)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 2px 16px rgba(30,58,32,0.06)")
                    }
                  >
                    <div
                      className="relative overflow-hidden h-52 cursor-pointer flex-shrink-0"
                      style={{ backgroundColor: product.imageBg ?? "#1e3a20" }}
                      onClick={() => {
                        setModalProduct(product);
                        setModalTab("benefits");
                      }}
                    >
                      <img
                        src={product.sizeImages?.[sizeIdx] ?? product.image}
                        alt={product.shortName}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span
                          className="text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1"
                          style={{
                            backgroundColor: "rgba(250,247,242,0.92)",
                            color: "#1e2d1f",
                          }}
                        >
                          View Details <ChevronRight size={12} />
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-sans"
                          style={{
                            backgroundColor: cat.bg,
                            color: cat.text,
                            fontSize: "0.68rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {product.section === "Sets & Merch"
                            ? "Set"
                            : product.category}
                        </span>
                        {product.isSet && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-sans"
                            style={{
                              backgroundColor: "rgba(201,168,76,0.9)",
                              color: "#1a2b1b",
                              fontSize: "0.65rem",
                            }}
                          >
                            10% Savings
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p
                        className="text-xs font-sans mb-1"
                        style={{ color: "#a07840", letterSpacing: "0.04em" }}
                      >
                        {product.tagline}
                      </p>
                      <h3
                        className="text-base leading-snug mb-2"
                        style={{ color: "#1e2d1f" }}
                      >
                        {product.shortName}
                      </h3>
                      <p
                        className="text-xs font-sans leading-relaxed mb-4 flex-1"
                        style={{ color: "#9c8870", lineHeight: "1.65" }}
                      >
                        {product.cardDescription}
                      </p>

                      {product.isSet && product.setIncludes && (
                        <div
                          className="mb-4 p-3 rounded-xl"
                          style={{ backgroundColor: "#f5f0e8" }}
                        >
                          <p
                            className="text-xs uppercase font-sans mb-1.5"
                            style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
                          >
                            What's Included
                          </p>
                          <ul className="space-y-0.5">
                            {product.setIncludes.map((item) => (
                              <li
                                key={item}
                                className="text-xs font-sans flex items-start gap-1.5"
                                style={{ color: "#4a3a2a" }}
                              >
                                <span
                                  className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: "#c9a84c" }}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!product.isSet && (
                        <div className="flex gap-1.5 mb-4 flex-wrap">
                          {product.sizes.length === 1 ? (
                            <span
                              className="text-xs font-sans px-2.5 py-1 rounded-full border"
                              style={{
                                borderColor: "#1e3a20",
                                backgroundColor: "#1e3a20",
                                color: "#fff",
                              }}
                            >
                              {product.sizes[0].label}
                            </span>
                          ) : (
                            product.sizes.map((s, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [product.id]: i,
                                  }))
                                }
                                className="text-xs font-sans px-2.5 py-1 rounded-full border transition-all duration-150"
                                style={{
                                  borderColor:
                                    sizeIdx === i ? "#1e3a20" : "#e0d8cc",
                                  backgroundColor:
                                    sizeIdx === i ? "#1e3a20" : "transparent",
                                  color: sizeIdx === i ? "#fff" : "#6b5c45",
                                }}
                              >
                                {s.label}
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      <div
                        className="flex items-center justify-between mt-auto pt-3 border-t"
                        style={{ borderColor: "#f0ebe1" }}
                      >
                        <span className="text-lg" style={{ color: "#1e3a20" }}>
                          ${size.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product, sizeIdx)}
                          className="px-4 py-2 rounded-full text-xs font-sans transition-all duration-200 active:scale-95"
                          style={{
                            backgroundColor:
                              addedId === itemId ? "#2d5a27" : "#1e3a20",
                            color: "#fff",
                            letterSpacing: "0.06em",
                          }}
                          onMouseEnter={(e) => {
                            if (addedId !== itemId)
                              e.currentTarget.style.backgroundColor = "#a07840";
                          }}
                          onMouseLeave={(e) => {
                            if (addedId !== itemId)
                              e.currentTarget.style.backgroundColor = "#1e3a20";
                          }}
                        >
                          {addedId === itemId ? "Added!" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Bloom 5.5 Promise ──────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#faf7f2" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl" style={{ color: "#1e2d1f" }}>
              The Bloom 5.5 Promise
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "pH Balanced",
                text: "Every formula is designed to support skin's ideal pH of 5.5 — helping maintain balance, comfort, and a resilient-looking complexion.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                ),
              },
              {
                title: "Clean & Transparent",
                text: "No parabens. No sulfates. No synthetic fragrances. No silicones. No phthalates. No mineral oil. No synthetic color additives. Every ingredient listed, every purpose explained.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                title: "Carefully Crafted",
                text: "Small-batch crafted in Edgewater, Maryland to ensure superior quality and preserve the freshness of our formulas.",
                icon: (
                  <img
                    src="/bloom/public/images/icons/hand-heart.png"
                    alt="Clean & Transparent"
                  />
                ),
              },
              {
                title: "Cruelty-Free",
                text: "Never tested on animals. Our products are kind to your skin and kind to every living thing.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
              },
            ].map(({ title, text, icon }) => (
              <div
                key={title}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ede7db",
                  boxShadow: "0 2px 12px rgba(30,58,32,0.05)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(30,58,32,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(30,58,32,0.05)")
                }
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#f0ebe1", color: "#1e3a20" }}
                >
                  {icon}
                </div>
                <div>
                  <h4 className="text-base mb-2" style={{ color: "#1e2d1f" }}>
                    {title}
                  </h4>
                  <p
                    className="text-sm font-sans leading-relaxed"
                    style={{ color: "#9c8870" }}
                  >
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inside the Formula ─────────────────────────────────────── */}
      <section
        id="inside-the-formula"
        className="py-20"
        style={{ backgroundColor: "#f0ebe1" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              What Goes In
            </p>
            <h2
              className="text-4xl md:text-5xl mb-5"
              style={{ color: "#1e2d1f", lineHeight: "1.15" }}
            >
              Inside the Formula
            </h2>
            <p
              className="font-sans text-base leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#6b5c45" }}
            >
              At Bloom 5.5, every ingredient is selected with purpose. Our
              formulas are designed to support skin's natural balance with
              thoughtful blends of desert botanicals, skin-identical
              ingredients, and lightweight oils that work in harmony with the
              skin to maintain its ideal pH 5.5.
            </p>
          </div>

          {/* Hero photo tile */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}images/products/Desert_Sage_Beard_Balm.png`}
                alt="Prickly Pear Seed Oil"
                className="rounded-2xl w-full object-cover shadow-xl"
                style={{ height: "420px" }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,30,21,0.85) 0%, rgba(20,30,21,0.45) 45%, transparent 70%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <p
                  className="font-semibold mb-1"
                  style={{ color: "#c9a84c", fontSize: "1rem" }}
                >
                  Prickly Pear Seed Oil – Nature's Liquid Gold
                </p>
                <p
                  className="text-sm font-sans italic"
                  style={{ color: "#e8dcc8" }}
                >
                  Our hero ingredient, cold-pressed from the seeds of the
                  Opuntia cactus.
                </p>
              </div>
            </div>
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-3 font-sans"
                style={{ color: "#a07840", letterSpacing: "0.2em" }}
              >
                Hero Ingredient
              </p>
              <h3
                className="text-3xl mb-5"
                style={{ color: "#1e2d1f", lineHeight: "1.2" }}
              >
                Prickly Pear Seed Oil
              </h3>
              <p
                className="font-sans text-base leading-relaxed"
                style={{ color: "#6b5c45" }}
              >
                Our hero ingredient, prized for its antioxidant-rich profile,
                fast-absorbing texture, and skin-loving fatty acids. Naturally
                rich in vitamin E, linoleic acid, plant sterols, and rare cactus
                antioxidants, it helps support a healthy-looking glow while
                keeping formulas lightweight and comfortable. It is the desert's
                answer to modern skin care: resilient, refined, and effective.
              </p>
            </div>
          </div>

          {/* 4 ingredient tiles */}
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Nourishing Botanical Oils and Butters",
                body: "We pair Prickly Pear Seed Oil with carefully chosen oils and butters that help soften, condition, and smooth the skin. Shea, Mango, Cocoa, and Murumuru Butters add richness and comfort, while Jojoba, Squalane, Argan, Rosehip, Hemp, and Evening Primrose Oils help deliver a balanced feel without heaviness. Together, they create formulas that nourish while still wearing beautifully on the skin.",
                icon: <Leaf size={18} />,
              },
              {
                title: "Barrier-Supporting Ingredients",
                body: "Our facial formulas include skin-supporting ingredients like Ceramides, Niacinamide, Glycerin, Panthenol, and Beta-Glucan to help maintain a soft, comfortable feel. These ingredients work alongside botanical extracts such as Centella Asiatica and Aloe Vera to create a clean, modern experience that feels soothing and balanced. The result is skincare that feels intentional, effective, and easy to use every day.",
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
              {
                title: "Why It Works",
                body: "We formulate with balance in mind. Prickly Pear Seed Oil brings radiance and antioxidant support, butters and oils provide softness and glide, and barrier-focused ingredients help skin feel comfortable and cared for. The result is a collection that feels lightweight, clean, and rooted in nature without sacrificing performance.",
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ),
              },
              {
                title: "The Bloom 5.5 Difference",
                body: "Every formula is developed at pH 5.5 to support skin's natural balance. We use clean, purposeful ingredients — no fillers, no shortcuts. Small-batch crafted in Maryland to ensure freshness and quality in every jar, pump, and tube.",
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
              },
            ].map(({ title, body, icon }) => (
              <div
                key={title}
                className="rounded-2xl p-7"
                style={{
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 12px rgba(30,58,32,0.05)",
                  border: "1px solid #ede7db",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f0ebe1", color: "#1e3a20" }}
                  >
                    {icon}
                  </div>
                  <h3 className="text-base" style={{ color: "#1e2d1f" }}>
                    {title}
                  </h3>
                </div>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: "#6b5c45" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Buzz ────────────────────────────────────────────── */}
      <section
        id="latest-buzz"
        className="py-20"
        style={{ backgroundColor: "#faf7f2" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              Community & Press
            </p>
            <h2 className="text-4xl mb-4" style={{ color: "#1e2d1f" }}>
              Latest Buzz
            </h2>
            <p
              className="font-sans text-base max-w-lg mx-auto"
              style={{ color: "#6b5c45" }}
            >
              Follow along for updates, skincare tips, and community highlights
              from the Bloom 5.5 family.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                platform: "Instagram",
                handle: "@mybloom55",
                cta: "Follow on Instagram",
                url: "https://www.instagram.com/mybloom55",
                color: "#7a4a2a",
              },
              {
                platform: "TikTok",
                handle: "@mybloom55",
                cta: "Follow on TikTok",
                url: "https://www.tiktok.com/@mybloom55",
                color: "#1e3a20",
              },
              {
                platform: "Facebook",
                handle: "Bloom 5.5",
                cta: "Join on Facebook",
                url: "https://www.facebook.com/mybloom55",
                color: "#2a3a4a",
              },
            ].map(({ platform, handle, cta, url, color }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-7 flex flex-col gap-3 transition-all duration-200 group"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ede7db",
                  boxShadow: "0 2px 12px rgba(30,58,32,0.05)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(30,58,32,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(30,58,32,0.05)")
                }
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span
                    className="text-xs font-sans font-bold"
                    style={{ color: "#fff" }}
                  >
                    {platform[0]}
                  </span>
                </div>
                <div>
                  <p
                    className="font-semibold mb-1"
                    style={{ color: "#1e2d1f" }}
                  >
                    {platform}
                  </p>
                  <p className="text-sm font-sans" style={{ color: "#9c8870" }}>
                    {handle}
                  </p>
                </div>
                <span
                  className="text-xs font-sans mt-auto flex items-center gap-1 transition-colors"
                  style={{ color: "#a07840" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#1e3a20")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#a07840")
                  }
                >
                  {cta} <ChevronRight size={12} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1a2b1b" }}>
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <img
                src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`}
                alt="Bloom 5.5"
                className="h-14 w-auto mb-4"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
              />
              <p
                className="text-sm font-sans leading-relaxed"
                style={{ color: "#7a9e7c" }}
              >
                Small-batch botanical skincare rooted in the power of Prickly
                Pear Seed Oil.
              </p>
              <div
                className="mt-4 space-y-1 text-xs font-sans"
                style={{ color: "#4a6e4c" }}
              >
                <p>TB Naturals</p>
                <p>Edgewater, MD 21037</p>
                <a
                  href="mailto:tbnaturals.cs@gmail.com"
                  className="hover:underline"
                  style={{ color: "#7a9e7c" }}
                >
                  tbnaturals.cs@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p
                className="text-xs uppercase font-sans tracking-widest mb-5"
                style={{ color: "#4a6e4c", letterSpacing: "0.2em" }}
              >
                Quick Links
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Shop the Collection",
                    href: "#shop-the-collection",
                  },
                  { label: "Our Story", href: "#story" },
                  { label: "Inside the Formula", href: "#inside-the-formula" },
                  { label: "Wholesale", href: "/wholesale", isRoute: true },
                  { label: "Latest Buzz", href: "#latest-buzz" },
                ].map(({ label, href, isRoute }) =>
                  isRoute ? (
                    <Link
                      key={label}
                      to={href}
                      className="block text-sm font-sans transition-colors"
                      style={{ color: "#7a9e7c" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#c9a84c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#7a9e7c")
                      }
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={label}
                      href={href}
                      className="block text-sm font-sans transition-colors"
                      style={{ color: "#7a9e7c" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#c9a84c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#7a9e7c")
                      }
                    >
                      {label}
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Social */}
            <div>
              <p
                className="text-xs uppercase font-sans tracking-widest mb-5"
                style={{ color: "#4a6e4c", letterSpacing: "0.2em" }}
              >
                Follow Along
              </p>
              <div className="flex gap-3 mb-3">
                {[
                  {
                    href: "https://www.instagram.com/mybloom55",
                    title: "Instagram",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.facebook.com/mybloom55",
                    title: "Facebook",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.tiktok.com/@mybloom55",
                    title: "TikTok",
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.youtube.com/@mybloom55",
                    title: "YouTube",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                      </svg>
                    ),
                  },
                ].map(({ href, title, icon }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={title}
                    className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                    style={{ backgroundColor: "#243d25", color: "#d4edcc" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c9a84c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#243d25")
                    }
                  >
                    {icon}
                  </a>
                ))}
              </div>
              <p className="text-xs font-sans" style={{ color: "#4a6e4c" }}>
                @mybloom55
              </p>
            </div>

            {/* Contact */}
            <div>
              <p
                className="text-xs uppercase font-sans tracking-widest mb-5"
                style={{ color: "#4a6e4c", letterSpacing: "0.2em" }}
              >
                Get in Touch
              </p>
              <p
                className="text-sm font-sans mb-4 leading-relaxed"
                style={{ color: "#7a9e7c" }}
              >
                Questions, orders, or wholesale inquiries? We'd love to hear
                from you.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setContactSent(false);
                    setContactForm({
                      name: "",
                      email: "",
                      reason: "",
                      message: "",
                    });
                    setContactOpen(true);
                  }}
                  className="w-full py-2.5 rounded-full text-sm font-sans transition-all duration-200"
                  style={{
                    backgroundColor: "#c9a84c",
                    color: "#1a2b1b",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d4b85a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c9a84c")
                  }
                >
                  Contact Us
                </button>
                <button
                  onClick={() => {
                    setReportSent(false);
                    setReportForm({
                      productName: "",
                      issueDescription: "",
                      contactInfo: "",
                      other: "",
                    });
                    setReportOpen(true);
                  }}
                  className="w-full py-2.5 rounded-full text-sm font-sans transition-all duration-200"
                  style={{
                    backgroundColor: "transparent",
                    color: "#7a9e7c",
                    border: "1px solid #3d5c3e",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#3d5c3e")
                  }
                >
                  Report a Problem
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6" style={{ borderColor: "#243d25" }}>
            <p
              className="text-xs font-sans text-center"
              style={{ color: "#3d5c3e" }}
            >
              © {new Date().getFullYear()} Bloom 5.5 by TB Naturals. All rights
              reserved. · Cruelty-Free · Paraben-Free · Carefully Crafted in
              Small Batches.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Email Popup ────────────────────────────────────────────── */}
      {popupOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(20,30,21,0.65)",
              backdropFilter: "blur(4px)",
            }}
            onClick={closePopup}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: "#faf7f2",
                boxShadow: "0 24px 80px rgba(20,30,21,0.35)",
              }}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full"
                style={{ backgroundColor: "#f0ebe1" }}
              >
                <X size={15} style={{ color: "#6b5c45" }} />
              </button>
              {/* Top bar */}
              <div
                className="px-8 pt-10 pb-6 text-center"
                style={{ backgroundColor: "#1e3a20" }}
              >
                <p
                  className="text-xs tracking-widest uppercase font-sans mb-2"
                  style={{ color: "#8aaa8c", letterSpacing: "0.2em" }}
                >
                  Welcome to Bloom 5.5
                </p>
                <h3 className="text-3xl mb-1" style={{ color: "#c9a84c" }}>
                  10% Off
                </h3>
                <p className="font-sans text-sm" style={{ color: "#a8c4aa" }}>
                  your first order
                </p>
              </div>
              <div className="px-8 py-7">
                {popupSent ? (
                  <div className="text-center py-4">
                    <p className="text-lg mb-2" style={{ color: "#1e2d1f" }}>
                      You're in!
                    </p>
                    <p
                      className="text-sm font-sans mb-4"
                      style={{ color: "#6b5c45" }}
                    >
                      Check your inbox for your 10% off code. Welcome to the
                      Bloom 5.5 family.
                    </p>
                    <button
                      onClick={closePopup}
                      className="px-8 py-3 rounded-full text-sm font-sans"
                      style={{ backgroundColor: "#1e3a20", color: "#fff" }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-sm font-sans text-center mb-5 leading-relaxed"
                      style={{ color: "#6b5c45" }}
                    >
                      Sign up for exclusive offers, skincare tips, and new
                      product launches.
                    </p>
                    <form onSubmit={submitPopup} className="space-y-3">
                      <input
                        required
                        type="email"
                        value={popupEmail}
                        onChange={(e) => setPopupEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className={inputCls}
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#1e3a20")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#e0d8cc")}
                      />
                      <button
                        type="submit"
                        disabled={popupSubmitting}
                        className="w-full py-3 rounded-full text-sm font-sans transition-all duration-200 disabled:opacity-60"
                        style={{
                          backgroundColor: "#1e3a20",
                          color: "#fff",
                          letterSpacing: "0.08em",
                        }}
                        onMouseEnter={(e) => {
                          if (!popupSubmitting)
                            e.currentTarget.style.backgroundColor = "#a07840";
                        }}
                        onMouseLeave={(e) => {
                          if (!popupSubmitting)
                            e.currentTarget.style.backgroundColor = "#1e3a20";
                        }}
                      >
                        {popupSubmitting ? "Subscribing..." : "Get 10% Off"}
                      </button>
                    </form>
                    <p
                      className="text-xs font-sans text-center mt-4"
                      style={{ color: "#b0a090" }}
                    >
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Contact Modal ──────────────────────────────────────────── */}
      {contactOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(20,30,21,0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setContactOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                backgroundColor: "#faf7f2",
                boxShadow: "0 24px 80px rgba(20,30,21,0.3)",
              }}
            >
              <button
                onClick={() => setContactOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full"
                style={{ backgroundColor: "#f0ebe1" }}
              >
                <X size={16} style={{ color: "#6b5c45" }} />
              </button>
              <div className="p-8">
                {contactSent ? (
                  <div className="text-center py-8">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "#d4edcc" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1e3a20"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl mb-2" style={{ color: "#1e2d1f" }}>
                      Message Sent!
                    </h3>
                    <p
                      className="text-sm font-sans"
                      style={{ color: "#6b5c45" }}
                    >
                      Thank you. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setContactOpen(false)}
                      className="mt-6 px-6 py-2.5 rounded-full text-sm font-sans"
                      style={{ backgroundColor: "#1e3a20", color: "#fff" }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-xs uppercase font-sans tracking-widest mb-1"
                      style={{ color: "#a07840", letterSpacing: "0.18em" }}
                    >
                      Bloom 5.5
                    </p>
                    <h3 className="text-2xl mb-5" style={{ color: "#1e2d1f" }}>
                      Contact Us
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const subject = encodeURIComponent(
                          `[Bloom 5.5] ${contactForm.reason} — ${contactForm.name}`,
                        );
                        const body = encodeURIComponent(
                          `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nReason: ${contactForm.reason}\n\n${contactForm.message}`,
                        );
                        window.location.href = `mailto:tbnaturals.cs@gmail.com?subject=${subject}&body=${body}`;
                        setContactSent(true);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          {
                            label: "Your Name",
                            key: "name",
                            type: "text",
                            placeholder: "Jane Smith",
                          },
                          {
                            label: "Email Address",
                            key: "email",
                            type: "email",
                            placeholder: "jane@email.com",
                          },
                        ].map(({ label, key, type, placeholder }) => (
                          <div key={key}>
                            <label
                              className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                              style={{
                                color: "#6b5c45",
                                letterSpacing: "0.12em",
                              }}
                            >
                              {label}
                            </label>
                            <input
                              required
                              type={type}
                              value={
                                contactForm[key as keyof typeof contactForm]
                              }
                              onChange={(e) =>
                                setContactForm((p) => ({
                                  ...p,
                                  [key]: e.target.value,
                                }))
                              }
                              placeholder={placeholder}
                              className={inputCls}
                              style={inputStyle}
                              onFocus={(e) =>
                                (e.target.style.borderColor = "#1e3a20")
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = "#e0d8cc")
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Reason for Contact
                        </label>
                        <select
                          required
                          value={contactForm.reason}
                          onChange={(e) =>
                            setContactForm((p) => ({
                              ...p,
                              reason: e.target.value,
                            }))
                          }
                          className={`${inputCls} appearance-none`}
                          style={{
                            ...inputStyle,
                            color: contactForm.reason ? "#1e2d1f" : "#9c8870",
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        >
                          <option value="" disabled>
                            Select a reason...
                          </option>
                          <option>Order Inquiry</option>
                          <option>Product Question</option>
                          <option>Wholesale / Retail Partnership</option>
                          <option>Press / Media Inquiry</option>
                          <option>Feedback or Review</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Message
                        </label>
                        <textarea
                          required
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm((p) => ({
                              ...p,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Tell us how we can help..."
                          rows={4}
                          className={`${inputCls} resize-none`}
                          style={inputStyle}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-full text-sm font-sans transition-all duration-200"
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
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Report a Problem Modal ─────────────────────────────────── */}
      {reportOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(20,30,21,0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setReportOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                backgroundColor: "#faf7f2",
                boxShadow: "0 24px 80px rgba(20,30,21,0.3)",
              }}
            >
              <button
                onClick={() => setReportOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full"
                style={{ backgroundColor: "#f0ebe1" }}
              >
                <X size={16} style={{ color: "#6b5c45" }} />
              </button>
              <div className="p-8">
                {reportSent ? (
                  <div className="text-center py-8">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "#d4edcc" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1e3a20"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl mb-2" style={{ color: "#1e2d1f" }}>
                      Report Received
                    </h3>
                    <p
                      className="text-sm font-sans"
                      style={{ color: "#6b5c45" }}
                    >
                      Thank you for letting us know. We take all feedback
                      seriously and will follow up if needed.
                    </p>
                    <button
                      onClick={() => setReportOpen(false)}
                      className="mt-6 px-6 py-2.5 rounded-full text-sm font-sans"
                      style={{ backgroundColor: "#1e3a20", color: "#fff" }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-xs uppercase font-sans tracking-widest mb-1"
                      style={{ color: "#a07840", letterSpacing: "0.18em" }}
                    >
                      Bloom 5.5
                    </p>
                    <h3 className="text-2xl mb-2" style={{ color: "#1e2d1f" }}>
                      Report a Problem
                    </h3>
                    <p
                      className="text-sm font-sans mb-6"
                      style={{ color: "#9c8870" }}
                    >
                      We're sorry to hear you had an issue. Please fill in the
                      details below so we can help.
                    </p>
                    <form onSubmit={submitReport} className="space-y-4">
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Product Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={reportForm.productName}
                          onChange={(e) =>
                            setReportForm((p) => ({
                              ...p,
                              productName: e.target.value,
                            }))
                          }
                          placeholder="e.g. Radiance Facial Moisturizer"
                          className={inputCls}
                          style={inputStyle}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Issue Description *
                        </label>
                        <textarea
                          required
                          value={reportForm.issueDescription}
                          onChange={(e) =>
                            setReportForm((p) => ({
                              ...p,
                              issueDescription: e.target.value,
                            }))
                          }
                          placeholder="Please provide a detailed description of the problem, including any skin reaction or other concerns."
                          rows={4}
                          className={`${inputCls} resize-none`}
                          style={inputStyle}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Contact Info
                        </label>
                        <input
                          type="text"
                          value={reportForm.contactInfo}
                          onChange={(e) =>
                            setReportForm((p) => ({
                              ...p,
                              contactInfo: e.target.value,
                            }))
                          }
                          placeholder="Email or phone (so we can follow up)"
                          className={inputCls}
                          style={inputStyle}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                          style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                        >
                          Other
                        </label>
                        <textarea
                          value={reportForm.other}
                          onChange={(e) =>
                            setReportForm((p) => ({
                              ...p,
                              other: e.target.value,
                            }))
                          }
                          placeholder="Anything else you'd like us to know..."
                          rows={2}
                          className={`${inputCls} resize-none`}
                          style={inputStyle}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#1e3a20")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e0d8cc")
                          }
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={reportSubmitting}
                        className="w-full py-3 rounded-full text-sm font-sans transition-all duration-200 disabled:opacity-60"
                        style={{
                          backgroundColor: "#1e3a20",
                          color: "#fff",
                          letterSpacing: "0.08em",
                        }}
                        onMouseEnter={(e) => {
                          if (!reportSubmitting)
                            e.currentTarget.style.backgroundColor = "#a07840";
                        }}
                        onMouseLeave={(e) => {
                          if (!reportSubmitting)
                            e.currentTarget.style.backgroundColor = "#1e3a20";
                        }}
                      >
                        {reportSubmitting ? "Submitting..." : "Submit Report"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Product Detail Modal ───────────────────────────────────── */}
      {modalProduct &&
        (() => {
          const sizeIdx = getSelectedSizeIndex(modalProduct.id);
          const size = modalProduct.sizes[sizeIdx];
          const itemId = `${modalProduct.id}-${sizeIdx}`;
          const cat = categoryColors[modalProduct.category] ?? {
            bg: "#1e3a20",
            text: "#d4edcc",
          };
          return (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setModalProduct(null)}
                style={{
                  backgroundColor: "rgba(20,30,21,0.55)",
                  backdropFilter: "blur(4px)",
                }}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
                <div
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
                  style={{
                    backgroundColor: "#faf7f2",
                    boxShadow: "0 24px 80px rgba(20,30,21,0.3)",
                  }}
                >
                  <button
                    onClick={() => setModalProduct(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "#f0ebe1" }}
                  >
                    <X size={16} style={{ color: "#6b5c45" }} />
                  </button>

                  <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div
                      className="relative h-64 md:h-auto md:min-h-80 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden flex items-center justify-center"
                      style={{
                        backgroundColor: modalProduct.imageBg ?? "#1e3a20",
                      }}
                    >
                      <img
                        src={
                          modalProduct.sizeImages?.[sizeIdx] ??
                          modalProduct.image
                        }
                        alt={modalProduct.shortName}
                        className="w-full h-full object-contain p-6"
                      />
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-sans"
                          style={{
                            backgroundColor: cat.bg,
                            color: cat.text,
                            fontSize: "0.68rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {modalProduct.category}
                        </span>
                        {modalProduct.isSet && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-sans"
                            style={{
                              backgroundColor: "#c9a84c",
                              color: "#1a2b1b",
                              fontSize: "0.65rem",
                            }}
                          >
                            10% Savings
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col">
                      <p
                        className="text-xs font-sans mb-1"
                        style={{ color: "#a07840", letterSpacing: "0.06em" }}
                      >
                        {modalProduct.tagline}
                      </p>
                      <h2
                        className="text-2xl mb-1"
                        style={{ color: "#1e2d1f", lineHeight: "1.2" }}
                      >
                        {modalProduct.shortName}
                      </h2>
                      <p
                        className="text-xs font-sans mb-5"
                        style={{ color: "#9c8870" }}
                      >
                        Bloom 5.5
                      </p>

                      {modalProduct.isSet && modalProduct.setIncludes && (
                        <div
                          className="mb-5 p-4 rounded-xl"
                          style={{ backgroundColor: "#f5f0e8" }}
                        >
                          <p
                            className="text-xs uppercase font-sans tracking-widest mb-2"
                            style={{
                              color: "#6b5c45",
                              letterSpacing: "0.12em",
                            }}
                          >
                            What's Included
                          </p>
                          <ul className="space-y-1">
                            {modalProduct.setIncludes.map((item) => (
                              <li
                                key={item}
                                className="text-sm font-sans flex items-start gap-2"
                                style={{ color: "#4a3a2a" }}
                              >
                                <span
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: "#c9a84c" }}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                          {modalProduct.availableNote && (
                            <p
                              className="text-xs font-sans mt-2 italic"
                              style={{ color: "#9c8870" }}
                            >
                              * {modalProduct.availableNote}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Tab selector */}
                      <div
                        className="flex gap-1 mb-5 p-1 rounded-xl"
                        style={{ backgroundColor: "#f0ebe1" }}
                      >
                        {[
                          { id: "benefits" as const, label: "Benefits" },
                          { id: "ingredients" as const, label: "Ingredients" },
                          { id: "howto" as const, label: "How to Use" },
                        ].map(({ id, label }) => (
                          <button
                            key={id}
                            onClick={() => setModalTab(id)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-sans transition-all duration-150"
                            style={{
                              backgroundColor:
                                modalTab === id ? "#fff" : "transparent",
                              color: modalTab === id ? "#1e2d1f" : "#9c8870",
                              boxShadow:
                                modalTab === id
                                  ? "0 1px 4px rgba(0,0,0,0.08)"
                                  : "none",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Tab content */}
                      {modalTab === "benefits" && (
                        <div className="space-y-3 flex-1">
                          {(
                            modalProduct.keyBenefits ?? modalProduct.benefits
                          ).map((b) => (
                            <div key={b} className="flex items-start gap-2">
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: "#c9a84c" }}
                              />
                              <p
                                className="text-sm font-sans leading-relaxed"
                                style={{ color: "#4a3a2a" }}
                              >
                                {b}
                              </p>
                            </div>
                          ))}
                          {modalProduct.shortDescription && (
                            <p
                              className="text-sm font-sans leading-relaxed mt-2 pt-3 border-t"
                              style={{
                                color: "#6b5c45",
                                borderColor: "#e8e0d0",
                              }}
                            >
                              {modalProduct.shortDescription}
                            </p>
                          )}
                          {modalProduct.bestFor && (
                            <div className="pt-2">
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-0.5"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                Best For
                              </p>
                              <p
                                className="text-sm font-sans"
                                style={{ color: "#4a3a2a" }}
                              >
                                {modalProduct.bestFor}
                              </p>
                            </div>
                          )}
                          {modalProduct.scentProfile && (
                            <div>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-0.5"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                Scent Profile
                              </p>
                              <p
                                className="text-sm font-sans"
                                style={{ color: "#4a3a2a" }}
                              >
                                {modalProduct.scentProfile}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {modalTab === "ingredients" && (
                        <div className="flex-1">
                          <p
                            className="text-xs uppercase font-sans tracking-widest mb-3"
                            style={{
                              color: "#6b5c45",
                              letterSpacing: "0.12em",
                            }}
                          >
                            Key Ingredients
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {modalProduct.heroIngredients.map((ing) => (
                              <span
                                key={ing}
                                className="text-xs font-sans px-2.5 py-1 rounded-full"
                                style={{
                                  backgroundColor: "#f0ebe1",
                                  color: "#5a4a35",
                                }}
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                          {modalProduct.ingredients && (
                            <>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-2 mt-4"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                Full Ingredient List (INCI)
                              </p>
                              <p
                                className="text-xs font-sans leading-relaxed"
                                style={{ color: "#6b5c45" }}
                              >
                                {modalProduct.ingredients}
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {modalTab === "howto" && (
                        <div className="flex-1">
                          {modalProduct.howToUse ? (
                            <>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-3"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                How to Use
                              </p>
                              <p
                                className="text-sm font-sans leading-relaxed"
                                style={{ color: "#4a3a2a" }}
                              >
                                {modalProduct.howToUse}
                              </p>
                            </>
                          ) : modalProduct.longDescription ? (
                            <>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-3"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                About This Product
                              </p>
                              {modalProduct.longDescription
                                .split("\n\n")
                                .map((para, i) => (
                                  <p
                                    key={i}
                                    className="text-sm font-sans leading-relaxed mb-3"
                                    style={{ color: "#4a3a2a" }}
                                  >
                                    {para}
                                  </p>
                                ))}
                            </>
                          ) : (
                            <p
                              className="text-sm font-sans"
                              style={{ color: "#9c8870" }}
                            >
                              No usage instructions available for this product.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Sizes & Add to cart */}
                      <div
                        className="mt-5 pt-4 border-t"
                        style={{ borderColor: "#e8e0d0" }}
                      >
                        {!modalProduct.isSet && (
                          <div className="flex gap-2 flex-wrap mb-4">
                            {modalProduct.sizes.map((s, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [modalProduct.id]: i,
                                  }))
                                }
                                className="text-sm font-sans px-4 py-2 rounded-full border transition-all duration-150"
                                style={{
                                  borderColor:
                                    sizeIdx === i ? "#1e3a20" : "#e0d8cc",
                                  backgroundColor:
                                    sizeIdx === i ? "#1e3a20" : "transparent",
                                  color: sizeIdx === i ? "#fff" : "#6b5c45",
                                }}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span
                            className="text-2xl"
                            style={{ color: "#1e3a20" }}
                          >
                            ${size.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(modalProduct, sizeIdx)}
                            className="px-6 py-3 rounded-full text-sm font-sans transition-all duration-200 active:scale-95"
                            style={{
                              backgroundColor:
                                addedId === itemId ? "#2d5a27" : "#1e3a20",
                              color: "#fff",
                              letterSpacing: "0.08em",
                            }}
                            onMouseEnter={(e) => {
                              if (addedId !== itemId)
                                e.currentTarget.style.backgroundColor =
                                  "#a07840";
                            }}
                            onMouseLeave={(e) => {
                              if (addedId !== itemId)
                                e.currentTarget.style.backgroundColor =
                                  "#1e3a20";
                            }}
                          >
                            {addedId === itemId
                              ? "Added to Cart!"
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

      {/* ── Cart Drawer ────────────────────────────────────────────── */}
      <>
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            backgroundColor: "rgba(30,45,31,0.4)",
            opacity: cartOpen ? 1 : 0,
            pointerEvents: cartOpen ? "auto" : "none",
          }}
          onClick={() => setCartOpen(false)}
        />
        <div
          className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out"
          style={{
            width: "min(420px, 100vw)",
            backgroundColor: "#faf7f2",
            boxShadow: "-8px 0 40px rgba(30,45,31,0.15)",
            transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{ borderColor: "#e8e0d0" }}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={18} style={{ color: "#1e3a20" }} />
              <h2 className="text-lg" style={{ color: "#1e2d1f" }}>
                Your Cart
                {cartCount > 0 && (
                  <span
                    className="text-sm font-sans ml-2"
                    style={{ color: "#a07840" }}
                  >
                    ({cartCount})
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "#f0ebe1" }}
            >
              <X size={16} style={{ color: "#6b5c45" }} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#f0ebe1" }}
                >
                  <ShoppingCart size={24} style={{ color: "#c9a84c" }} />
                </div>
                <p style={{ color: "#6b5c45" }}>Your cart is empty</p>
                <p className="text-sm font-sans" style={{ color: "#9c8870" }}>
                  Discover our botanical collection above.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-2 text-sm font-sans underline"
                  style={{ color: "#a07840" }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0ebe1",
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: "#1e3a20" }}
                    >
                      <img
                        src={item.image}
                        alt={item.shortName}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "#1e2d1f" }}
                      >
                        {item.shortName}
                      </p>
                      <p
                        className="text-xs font-sans mt-0.5"
                        style={{ color: "#a07840" }}
                      >
                        {item.sizeLabel}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center border"
                            style={{ borderColor: "#e0d8cc", color: "#6b5c45" }}
                          >
                            <Minus size={10} style={{ color: "#6b5c45" }} />
                          </button>
                          <span
                            className="text-sm w-4 text-center font-sans"
                            style={{ color: "#1e2d1f" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center border"
                            style={{ borderColor: "#e0d8cc", color: "#6b5c45" }}
                          >
                            <Plus size={10} style={{ color: "#6b5c45" }} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-sans"
                            style={{ color: "#1e3a20" }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center"
                            style={{ color: "#c0b0a0" }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div
              className="px-6 py-5 border-t"
              style={{ borderColor: "#e8e0d0" }}
            >
              <div className="flex justify-between mb-4">
                <span className="font-sans" style={{ color: "#6b5c45" }}>
                  Subtotal
                </span>
                <span style={{ color: "#1e2d1f" }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <p
                className="text-xs font-sans mb-4 text-center"
                style={{ color: "#9c8870" }}
              >
                Shipping calculated at checkout
              </p>
              <button
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
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onSuccess={() => {
          setCartItems([]);
        }}
      />
    </div>
  );
}
