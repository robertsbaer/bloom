import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Menu,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { products, categoryColors, type Product } from "./data";

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

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>(
    {},
  );
  const [addedId, setAddedId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(250,247,242,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e8e0d0",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`}
            alt="Bloom 5.5"
            className="h-10 w-auto"
          />

          <nav className="hidden md:flex items-center gap-8">
            {["About", "Products", "Ingredients"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm uppercase transition-colors duration-200 font-sans"
                style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a07840")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5c45")}
              >
                {label}
              </a>
            ))}
            <Link
              to="/wholesale"
              className="text-sm uppercase transition-colors duration-200 font-sans"
              style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a07840")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b5c45")}
            >
              Wholesale
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
              <ShoppingCart size={16} />
              <span
                className="hidden sm:inline"
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
              className="md:hidden"
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
            className="md:hidden px-6 pb-4 flex flex-col gap-4 border-t"
            style={{ borderColor: "#e8e0d0" }}
          >
            {["Products", "About", "Ingredients"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm uppercase font-sans"
                style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              to="/wholesale"
              className="text-sm uppercase font-sans"
              style={{ color: "#6b5c45", letterSpacing: "0.12em" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Wholesale
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #2d5a27 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-4 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              Natural · pH Balanced · Botanical
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{ color: "#1e2d1f", lineHeight: "1.1" }}
            >
              Skin that
              <br />
              <span style={{ color: "#a07840" }}>blooms</span>
              <br />
              naturally.
            </h1>
            <p
              className="text-lg mb-8 leading-relaxed font-sans"
              style={{ color: "#6b5c45", maxWidth: "440px" }}
            >
              Crafted at pH 5.5 — your skin's natural balance — our botanical
              formulas work with your body, not against it.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="px-8 py-3.5 rounded-full text-sm font-sans transition-all duration-200"
                style={{
                  backgroundColor: "#1e3a20",
                  color: "#fff",
                  letterSpacing: "0.08em",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d5a27")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e3a20")
                }
              >
                Shop the Collection
              </a>
              <a
                href="#about"
                className="px-8 py-3.5 rounded-full text-sm font-sans border transition-all duration-200"
                style={{
                  borderColor: "#c9a84c",
                  color: "#a07840",
                  letterSpacing: "0.08em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c9a84c";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#a07840";
                }}
              >
                Our Story
              </a>
            </div>
            <div className="flex gap-8 mt-12">
              {[
                ["100%", "Natural Ingredients"],
                ["pH 5.5", "Balanced Formula"],
                ["0", "Harsh Chemicals"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: "#1e3a20" }}
                  >
                    {val}
                  </p>
                  <p
                    className="text-xs font-sans mt-0.5"
                    style={{ color: "#9c8870" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full scale-110"
                style={{
                  background:
                    "radial-gradient(circle at center, #f0e8d8 0%, transparent 70%)",
                }}
              />
              <img
                src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`}
                alt="Bloom 5.5"
                className="relative w-72 h-72 md:w-96 md:h-96 object-contain"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(30,58,32,0.15))",
                }}
              />
              <div className="relative mt-4 flex flex-col items-center">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase font-sans"
                  style={{ color: "#a07840" }}
                >
                  by TB Naturals
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-24 overflow-hidden"
        style={{ backgroundColor: "#faf7f2" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              Our Story
            </p>
            <h2
              className="text-4xl md:text-5xl mb-5"
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
              Bloom 5.5 was born from a simple belief: your skin deserves better
              than shortcuts. Every formula we craft is designed to work with
              your biology — not override it.
            </p>
          </div>

          {/* Founder story */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Small-batch handcrafted skincare"
                className="rounded-2xl w-full object-cover shadow-xl"
                style={{ height: "520px" }}
              />
              <div
                className="absolute -top-5 -right-5 w-36 h-36 rounded-full opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute -bottom-5 -left-5 rounded-2xl px-6 py-5"
                style={{ backgroundColor: "#1e3a20", maxWidth: "220px" }}
              >
                <p
                  className="text-3xl font-semibold"
                  style={{ color: "#c9a84c" }}
                >
                  Small Batch
                </p>
                <p
                  className="text-xs font-sans mt-1 leading-relaxed"
                  style={{ color: "#8aaa8c" }}
                >
                  Handcrafted in Edgewater, Maryland
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
              <h3
                className="text-3xl mb-6"
                style={{ color: "#1e2d1f", lineHeight: "1.2" }}
              >
                Skincare made with
                <br />
                intention and purpose
              </h3>
              <div
                className="space-y-4 font-sans text-base leading-relaxed"
                style={{ color: "#6b5c45" }}
              >
                <p>
                  TB Naturals was founded on the principle that effective
                  skincare doesn't need a long list of synthetic fillers.
                  Everything in a Bloom 5.5 formula earns its place — each
                  ingredient selected for its proven function and compatibility
                  with your skin's own chemistry.
                </p>
                <p>
                  We formulate at{" "}
                  <strong style={{ color: "#1e3a20" }}>pH 5.5</strong> — the
                  precise level of your skin's natural acid mantle — so actives
                  absorb deeper, the barrier stays intact, and your skin feels
                  balanced from the first use. Not too acidic, not too alkaline.
                  Just right.
                </p>
                <p>
                  Every product is handcrafted in small batches in Edgewater,
                  Maryland, and tested to ensure it meets our standards before
                  it reaches you. No mass-production shortcuts. No compromises.
                </p>
              </div>
            </div>
          </div>

          {/* pH 5.5 callout */}
          <div
            className="rounded-3xl py-14 px-8 md:px-16 mb-24 relative overflow-hidden"
            style={{ backgroundColor: "#1e3a20" }}
          >
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
                transform: "translate(-30%, 30%)",
              }}
            />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p
                  className="text-xs tracking-widest uppercase mb-3 font-sans"
                  style={{ color: "#8aaa8c", letterSpacing: "0.2em" }}
                >
                  The Science Behind the Name
                </p>
                <h3
                  className="text-4xl md:text-5xl mb-5 font-serif"
                  style={{ color: "#c9a84c" }}
                >
                  Why pH 5.5?
                </h3>
                <p
                  className="font-sans text-base leading-relaxed"
                  style={{ color: "#8aaa8c" }}
                >
                  Your skin's acid mantle — its outermost protective layer —
                  naturally sits at a pH of 5.5. When you use products that are
                  too alkaline (like many traditional cleansers), this barrier
                  is disrupted, leaving skin vulnerable to dryness, irritation,
                  and sensitivity.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "pH 5.5", label: "Every formula precisely balanced" },
                  { stat: "100%", label: "Natural, purposeful ingredients" },
                  { stat: "Zero", label: "Parabens, sulfates & synthetics" },
                  { stat: "Small", label: "Batches — never mass produced" },
                ].map(({ stat, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    <p
                      className="text-2xl font-semibold mb-1"
                      style={{ color: "#c9a84c" }}
                    >
                      {stat}
                    </p>
                    <p
                      className="text-xs font-sans leading-snug"
                      style={{ color: "#7a9e7c" }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero ingredient */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-4 font-sans"
                style={{ color: "#a07840", letterSpacing: "0.2em" }}
              >
                Our Hero Ingredient
              </p>
              <h3
                className="text-3xl mb-6"
                style={{ color: "#1e2d1f", lineHeight: "1.2" }}
              >
                Prickly Pear Seed Oil —<br />
                <span style={{ color: "#a07840" }}>nature's liquid gold</span>
              </h3>
              <p
                className="font-sans text-base leading-relaxed mb-6"
                style={{ color: "#6b5c45" }}
              >
                Cold-pressed from the tiny seeds of the Opuntia cactus, Prickly
                Pear Seed Oil is one of the world's most nutrient-dense
                botanical oils. It takes over a ton of prickly pear fruit to
                produce just one liter of this oil — and the results speak for
                themselves.
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Vitamin E — highest of any plant oil",
                    desc: "Protects skin from oxidative stress and environmental damage.",
                  },
                  {
                    title: "Vitamin K",
                    desc: "Helps brighten dark circles and support an even skin tone.",
                  },
                  {
                    title: "Essential Fatty Acids (Omega 6 & 9)",
                    desc: "Nourish and support the skin barrier without clogging pores.",
                  },
                  {
                    title: "Betalains & Polyphenols",
                    desc: "Rare antioxidant compounds that help soothe inflammation and calm reactive skin.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#c9a84c" }}
                    />
                    <div>
                      <p
                        className="text-sm font-semibold font-sans"
                        style={{ color: "#1e2d1f" }}
                      >
                        {title}
                      </p>
                      <p
                        className="text-sm font-sans mt-0.5"
                        style={{ color: "#9c8870" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Prickly pear seed oil"
                className="rounded-2xl w-full object-cover shadow-xl"
                style={{ height: "480px" }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(30,42,31,0.4) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <p
                  className="text-sm font-sans italic"
                  style={{ color: "#e8dcc8" }}
                >
                  "It takes over a ton of fruit to yield just one liter of this
                  oil."
                </p>
              </div>
            </div>
          </div>

          {/* Brand values */}
          <div className="text-center mb-12">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              What We Stand For
            </p>
            <h3 className="text-3xl mb-3" style={{ color: "#1e2d1f" }}>
              The Bloom 5.5 Promise
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "pH-Balanced",
                text: "Every formula sits at pH 5.5 — your skin's natural sweet spot for absorption, balance, and resilience.",
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
              {
                title: "Clean & Transparent",
                text: "No parabens, sulfates, or synthetic fragrances. Every ingredient listed, every purpose explained.",
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
                title: "Handcrafted",
                text: "Made in small batches in Maryland. Never mass-produced. Each formula gets the time and care it deserves.",
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
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
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

      {/* Products */}
      <section id="products" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-xs tracking-widest uppercase mb-3 font-sans"
              style={{ color: "#a07840", letterSpacing: "0.2em" }}
            >
              The Collection
            </p>
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{ color: "#1e2d1f" }}
            >
              Made for your skin's best day
            </h2>
            <p
              className="font-sans text-base max-w-xl mx-auto"
              style={{ color: "#6b5c45" }}
            >
              Each product is a small ritual — designed to nourish, protect, and
              celebrate the skin you're in.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
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
                  {/* Image */}
                  <div
                    className="relative overflow-hidden h-52 cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: "#f5f0e8" }}
                    onClick={() => setModalProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.shortName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-sans"
                        style={{
                          backgroundColor: cat.bg,
                          color: cat.text,
                          fontSize: "0.68rem",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
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

                    {/* Size selector */}
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

                    <div className="flex items-center justify-between mt-auto">
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
        </div>
      </section>

      {/* Ingredients section */}
      <section
        id="ingredients"
        className="py-20"
        style={{ backgroundColor: "#f0ebe1" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-3 font-sans"
                style={{ color: "#a07840", letterSpacing: "0.2em" }}
              >
                What's Inside
              </p>
              <h2 className="text-4xl mb-6" style={{ color: "#1e2d1f" }}>
                Ingredients you can trust
              </h2>
              <p
                className="font-sans text-base leading-relaxed mb-8"
                style={{ color: "#6b5c45" }}
              >
                Every Bloom 5.5 product is built on a foundation of botanicals —
                ingredients your skin recognizes and absorbs naturally.
              </p>
              <div className="space-y-4">
                {[
                  {
                    name: "Prickly Pear Seed Oil",
                    benefit:
                      "Rich in vitamin E and antioxidants that help support and protect skin.",
                  },
                  {
                    name: "Hyaluronic Acid",
                    benefit:
                      "Helps attract and retain moisture for a plumper, more hydrated look.",
                  },
                  {
                    name: "Bakuchiol",
                    benefit:
                      "A plant-derived retinol alternative that may help smooth and brighten skin with less irritation for many users.",
                  },
                  {
                    name: "Ceramides & Beta-Glucan",
                    benefit:
                      "Help strengthen the skin barrier and support moisture retention.",
                  },
                ].map(({ name, benefit }) => (
                  <div key={name} className="flex gap-4 items-start">
                    <div
                      className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#1e3a20" }}
                    >
                      <Leaf size={10} color="#d4edcc" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold font-sans"
                        style={{ color: "#1e2d1f" }}
                      >
                        {name}
                      </p>
                      <p
                        className="text-sm font-sans mt-0.5"
                        style={{ color: "#9c8870" }}
                      >
                        {benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6621380/pexels-photo-6621380.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Natural ingredients"
                className="rounded-2xl w-full object-cover shadow-xl"
                style={{ height: "480px" }}
              />
              <div
                className="absolute -bottom-4 -left-4 rounded-2xl px-6 py-4"
                style={{ backgroundColor: "#1e3a20", maxWidth: "200px" }}
              >
                <p
                  className="text-3xl font-semibold"
                  style={{ color: "#c9a84c" }}
                >
                  pH 5.5
                </p>
                <p
                  className="text-xs font-sans mt-1"
                  style={{ color: "#8aaa8c" }}
                >
                  Perfectly balanced for your skin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a2b1b" }}>
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-10">
            {/* Brand */}
            <div>
              <img
                src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`}
                alt="Bloom 5.5"
                className="h-16 w-auto mb-4"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
              />
              <p
                className="text-sm font-sans leading-relaxed"
                style={{ color: "#7a9e7c" }}
              >
                Small-batch botanical skincare rooted in the power of Prickly
                Pear Seed Oil. Crafted with purpose in Edgewater, Maryland.
              </p>
              <p
                className="text-xs font-sans mt-3"
                style={{ color: "#4a6e4c" }}
              >
                TB Naturals · Edgewater, MD 21037
              </p>
            </div>

            {/* Follow */}
            <div className="md:text-center">
              <p
                className="text-xs uppercase font-sans tracking-widest mb-5"
                style={{ color: "#4a6e4c", letterSpacing: "0.2em" }}
              >
                Follow Along
              </p>
              <div className="flex md:justify-center gap-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/mybloom55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{ backgroundColor: "#243d25" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#243d25")
                  }
                  title="Instagram"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#d4edcc" }}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/mybloom55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{ backgroundColor: "#243d25" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#243d25")
                  }
                  title="Facebook"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#d4edcc" }}
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@mybloom55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{ backgroundColor: "#243d25" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#243d25")
                  }
                  title="TikTok"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: "#d4edcc" }}
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@mybloom55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{ backgroundColor: "#243d25" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#243d25")
                  }
                  title="YouTube"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#d4edcc" }}
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </a>
              </div>
              <p
                className="text-xs font-sans mt-4"
                style={{ color: "#4a6e4c" }}
              >
                @mybloom55
              </p>
            </div>

            {/* Contact */}
            <div className="md:text-right">
              <p
                className="text-xs uppercase font-sans tracking-widest mb-5"
                style={{ color: "#4a6e4c", letterSpacing: "0.2em" }}
              >
                Get in Touch
              </p>
              <p
                className="text-sm font-sans mb-5"
                style={{ color: "#7a9e7c" }}
              >
                Questions about products, orders, or wholesale? We'd love to
                hear from you.
              </p>
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans transition-all duration-200"
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
            </div>
          </div>

          <div className="border-t pt-6" style={{ borderColor: "#243d25" }}>
            <p
              className="text-xs font-sans text-center"
              style={{ color: "#3d5c3e" }}
            >
              © {new Date().getFullYear()} Bloom 5.5 by TB Naturals. All rights
              reserved. Cruelty-Free · Paraben-Free · Handcrafted in Small
              Batches.
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
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
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "#f0ebe1" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e8e0d0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0ebe1")
                }
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
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
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
                    <h3 className="text-2xl mb-1" style={{ color: "#1e2d1f" }}>
                      Contact Us
                    </h3>
                    <p
                      className="text-sm font-sans mb-6"
                      style={{ color: "#9c8870" }}
                    >
                      We'd love to hear from you. Fill out the form below and
                      we'll be in touch.
                    </p>

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
                        <div>
                          <label
                            className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                            style={{
                              color: "#6b5c45",
                              letterSpacing: "0.12em",
                            }}
                          >
                            Your Name
                          </label>
                          <input
                            required
                            type="text"
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Jane Smith"
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all"
                            style={{
                              backgroundColor: "#f5f0e8",
                              border: "1.5px solid #e0d8cc",
                              color: "#1e2d1f",
                            }}
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
                            style={{
                              color: "#6b5c45",
                              letterSpacing: "0.12em",
                            }}
                          >
                            Email Address
                          </label>
                          <input
                            required
                            type="email"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            placeholder="jane@email.com"
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all"
                            style={{
                              backgroundColor: "#f5f0e8",
                              border: "1.5px solid #e0d8cc",
                              color: "#1e2d1f",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#1e3a20")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e0d8cc")
                            }
                          />
                        </div>
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
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all appearance-none"
                          style={{
                            backgroundColor: "#f5f0e8",
                            border: "1.5px solid #e0d8cc",
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
                          <option value="Order Inquiry">Order Inquiry</option>
                          <option value="Product Question">
                            Product Question
                          </option>
                          <option value="Wholesale / Retail Partnership">
                            Wholesale / Retail Partnership
                          </option>
                          <option value="Press / Media Inquiry">
                            Press / Media Inquiry
                          </option>
                          <option value="Subscription or Account">
                            Subscription or Account
                          </option>
                          <option value="Feedback or Review">
                            Feedback or Review
                          </option>
                          <option value="Other">Other</option>
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
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all resize-none"
                          style={{
                            backgroundColor: "#f5f0e8",
                            border: "1.5px solid #e0d8cc",
                            color: "#1e2d1f",
                          }}
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

      {/* Product Detail Modal */}
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                onClick={() => setModalProduct(null)}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "rgba(20,30,21,0.55)",
                    backdropFilter: "blur(4px)",
                  }}
                />
              </div>

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
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: "#f0ebe1" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e8e0d0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0ebe1")
                    }
                  >
                    <X size={16} style={{ color: "#6b5c45" }} />
                  </button>

                  <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div
                      className="relative h-72 md:h-auto md:min-h-96 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: "#f5f0e8" }}
                    >
                      <img
                        src={modalProduct.image}
                        alt={modalProduct.shortName}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-4 left-4">
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
                        className="text-xs font-sans mb-4"
                        style={{ color: "#9c8870" }}
                      >
                        Bloom 5.5
                      </p>

                      {/* Benefits */}
                      <div className="mb-4">
                        <p
                          className="text-xs uppercase font-sans tracking-widest mb-2"
                          style={{ color: "#6b5c45", letterSpacing: "0.15em" }}
                        >
                          Benefits
                        </p>
                        <ul className="space-y-1">
                          {modalProduct.benefits.map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-2 text-sm font-sans"
                              style={{ color: "#4a3a2a" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: "#c9a84c" }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hero Ingredients */}
                      <div className="mb-4">
                        <p
                          className="text-xs uppercase font-sans tracking-widest mb-2"
                          style={{ color: "#6b5c45", letterSpacing: "0.15em" }}
                        >
                          Key Ingredients
                        </p>
                        <div className="flex flex-wrap gap-1.5">
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
                      </div>

                      {/* Extra info */}
                      {(modalProduct.bestFor ||
                        modalProduct.scentProfile ||
                        modalProduct.howToUse) && (
                        <div className="mb-4 space-y-2">
                          {modalProduct.bestFor && (
                            <div>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-0.5"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.15em",
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
                                  letterSpacing: "0.15em",
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
                          {modalProduct.howToUse && (
                            <div>
                              <p
                                className="text-xs uppercase font-sans tracking-widest mb-0.5"
                                style={{
                                  color: "#6b5c45",
                                  letterSpacing: "0.15em",
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
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sizes */}
                      <div className="mb-5">
                        <p
                          className="text-xs uppercase font-sans tracking-widest mb-2"
                          style={{ color: "#6b5c45", letterSpacing: "0.15em" }}
                        >
                          Size
                        </p>
                        <div className="flex gap-2 flex-wrap">
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
                      </div>

                      <div
                        className="flex items-center justify-between mt-auto pt-4 border-t"
                        style={{ borderColor: "#e8e0d0" }}
                      >
                        <span className="text-2xl" style={{ color: "#1e3a20" }}>
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
                              e.currentTarget.style.backgroundColor = "#a07840";
                          }}
                          onMouseLeave={(e) => {
                            if (addedId !== itemId)
                              e.currentTarget.style.backgroundColor = "#1e3a20";
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
            </>
          );
        })()}

      {/* Cart Drawer */}
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
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: "#f0ebe1" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e8e0d0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0ebe1")
              }
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
                    <img
                      src={item.image}
                      alt={item.shortName}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
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
                            className="w-6 h-6 rounded-full flex items-center justify-center border transition-colors"
                            style={{ borderColor: "#e8e0d0" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f0ebe1")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <Minus size={10} style={{ color: "#6b5c45" }} />
                          </button>
                          <span
                            className="text-sm w-5 text-center font-sans"
                            style={{ color: "#1e2d1f" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center border transition-colors"
                            style={{ borderColor: "#e8e0d0" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f0ebe1")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <Plus size={10} style={{ color: "#6b5c45" }} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-sm font-semibold font-sans"
                            style={{ color: "#1e3a20" }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                          >
                            <X size={12} style={{ color: "#6b5c45" }} />
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
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm font-sans"
                  style={{ color: "#9c8870" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-sm font-sans"
                  style={{ color: "#6b5c45" }}
                >
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-5">
                <span
                  className="text-sm font-sans"
                  style={{ color: "#9c8870" }}
                >
                  Shipping
                </span>
                <span
                  className="text-sm font-sans"
                  style={{ color: "#2d5a27" }}
                >
                  {cartTotal >= 50 ? "Free" : "$4.99"}
                </span>
              </div>
              <div
                className="flex justify-between mb-6 pt-4 border-t"
                style={{ borderColor: "#e8e0d0" }}
              >
                <span className="font-semibold" style={{ color: "#1e2d1f" }}>
                  Total
                </span>
                <span
                  className="font-semibold text-lg"
                  style={{ color: "#1e3a20" }}
                >
                  ${(cartTotal + (cartTotal >= 50 ? 0 : 4.99)).toFixed(2)}
                </span>
              </div>
              {cartTotal < 50 && (
                <p
                  className="text-xs text-center font-sans mb-4"
                  style={{ color: "#a07840" }}
                >
                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}
              <button
                className="w-full py-3.5 rounded-full text-sm font-sans tracking-wide transition-all duration-200"
                style={{
                  backgroundColor: "#1e3a20",
                  color: "#fff",
                  letterSpacing: "0.08em",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d5a27")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e3a20")
                }
              >
                Checkout — Coming Soon
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full mt-2 py-2.5 text-sm font-sans"
                style={{ color: "#a07840" }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </>
    </div>
  );
}
