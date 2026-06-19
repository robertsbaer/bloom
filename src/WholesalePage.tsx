import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Plus, Minus, ArrowLeft, Menu, X } from 'lucide-react';
import { products, categoryColors } from './data';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function WholesalePage() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [info, setInfo] = useState({
    businessName: '', contactName: '', email: '', phone: '',
    businessType: '', state: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = Object.values(qty).reduce((s, v) => s + v, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const items = products.flatMap(p =>
      p.sizes.map((s, i) => {
        const key = `${p.id}-${i}`;
        const q = qty[key] ?? 0;
        return q > 0 ? { productId: p.id, name: p.shortName, size: s.label, price: s.price, quantity: q } : null;
      }).filter(Boolean)
    );
    if (items.length === 0) {
      setError('Please add at least one product to your order.');
      return;
    }
    setError('');
    setSubmitting(true);
    const { error: dbError } = await supabase.from('wholesale_inquiries').insert({
      business_name: info.businessName,
      contact_name: info.contactName,
      email: info.email,
      phone: info.phone || null,
      business_type: info.businessType || null,
      state: info.state || null,
      items,
      notes: info.notes || null,
    });
    setSubmitting(false);
    if (dbError) {
      setError('Something went wrong. Please try again.');
    } else {
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const inputStyle = {
    backgroundColor: '#f5f0e8',
    border: '1.5px solid #e0d8cc',
    color: '#1e2d1f',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f2', fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <header className="sticky top-0 z-50"
        style={{ backgroundColor: 'rgba(250,247,242,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e8e0d0' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-sans transition-colors"
              style={{ color: '#6b5c45' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a07840')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b5c45')}>
              <ArrowLeft size={15} />
              <span className="hidden sm:inline" style={{ letterSpacing: '0.04em' }}>Back to Store</span>
            </Link>
            <div className="w-px h-5" style={{ backgroundColor: '#e0d8cc' }} />
            <img src={`${import.meta.env.BASE_URL}bloom__social_full_whitebg.png`} alt="Bloom 5.5" className="h-9 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-sans uppercase tracking-widest" style={{ color: '#a07840', letterSpacing: '0.2em' }}>
              Wholesale Portal
            </span>
          </div>

          {totalItems > 0 && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans"
              style={{ backgroundColor: '#f0ebe1', color: '#1e3a20' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#1e3a20', color: '#fff' }}>
                {totalItems}
              </span>
              item{totalItems !== 1 ? 's' : ''} selected
            </div>
          )}

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} style={{ color: '#6b5c45' }} /> : <Menu size={20} style={{ color: '#6b5c45' }} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 border-t" style={{ borderColor: '#e8e0d0' }}>
            <p className="text-xs font-sans uppercase tracking-widest mt-3" style={{ color: '#a07840', letterSpacing: '0.2em' }}>
              Wholesale Portal
            </p>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {sent ? (
          /* Success state */
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#d4edcc' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="text-3xl mb-4" style={{ color: '#1e2d1f' }}>Inquiry Received!</h1>
            <p className="font-sans text-base leading-relaxed mb-2" style={{ color: '#6b5c45' }}>
              Thank you for your interest in carrying Bloom 5.5. We'll review your order and reach out within 2–3 business days with wholesale pricing and next steps.
            </p>
            <p className="font-sans text-sm mb-10" style={{ color: '#9c8870' }}>
              A confirmation will be sent to <strong style={{ color: '#1e2d1f' }}>{info.email}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setSent(false); setQty({}); setInfo({ businessName: '', contactName: '', email: '', phone: '', businessType: '', state: '', notes: '' }); }}
                className="px-8 py-3 rounded-full text-sm font-sans border transition-all duration-200"
                style={{ borderColor: '#1e3a20', color: '#1e3a20' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1e3a20'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1e3a20'; }}>
                Submit Another Inquiry
              </button>
              <Link to="/"
                className="px-8 py-3 rounded-full text-sm font-sans text-center transition-all duration-200"
                style={{ backgroundColor: '#1e3a20', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2d5a27')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e3a20')}>
                Back to Store
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Page header */}
            <div className="mb-14">
              <p className="text-xs tracking-widest uppercase mb-3 font-sans" style={{ color: '#a07840', letterSpacing: '0.2em' }}>
                Trade & Retail
              </p>
              <h1 className="text-4xl md:text-5xl mb-5" style={{ color: '#1e2d1f', lineHeight: '1.1' }}>
                Wholesale Ordering
              </h1>
              <p className="font-sans text-base leading-relaxed max-w-2xl" style={{ color: '#6b5c45' }}>
                Select the products and quantities you're interested in, then fill in your business details below.
                We'll follow up with wholesale pricing, minimums, and availability within 2–3 business days.
              </p>
            </div>

            {/* Products */}
            <div className="mb-16">
              <div className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
                <h2 className="text-2xl" style={{ color: '#1e2d1f' }}>Select Products</h2>
                {totalItems > 0 && (
                  <span className="text-sm font-sans" style={{ color: '#a07840' }}>
                    {totalItems} unit{totalItems !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(product => {
                  const cat = categoryColors[product.category] ?? { bg: '#1e3a20', text: '#d4edcc' };
                  const hasSelection = product.sizes.some((_, i) => (qty[`${product.id}-${i}`] ?? 0) > 0);

                  return (
                    <div key={product.id}
                      className="rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        backgroundColor: '#fff',
                        boxShadow: hasSelection
                          ? '0 0 0 2px #1e3a20, 0 8px 32px rgba(30,58,32,0.12)'
                          : '0 2px 12px rgba(30,58,32,0.06)',
                      }}>
                      {/* Product image */}
                      <div className="flex items-center justify-center h-36" style={{ backgroundColor: '#1e3a20' }}>
                        <img src={product.image} alt={product.shortName} className="h-28 w-28 object-contain" />
                      </div>

                      <div className="p-4">
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full font-sans mb-2"
                          style={{ backgroundColor: cat.bg, color: cat.text, fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                          {product.category}
                        </span>
                        <h3 className="text-sm leading-snug mb-1" style={{ color: '#1e2d1f' }}>
                          {product.shortName}
                        </h3>
                        <p className="text-xs font-sans mb-3" style={{ color: '#9c8870' }}>
                          {product.tagline}
                        </p>

                        <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#f0ebe1' }}>
                          {product.sizes.map((size, i) => {
                            const key = `${product.id}-${i}`;
                            const count = qty[key] ?? 0;
                            return (
                              <div key={i} className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-sans truncate" style={{ color: '#6b5c45' }}>{size.label}</p>
                                  <p className="text-xs font-sans" style={{ color: '#a07840' }}>${size.price.toFixed(2)} retail</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button type="button"
                                    onClick={() => setQty(p => ({ ...p, [key]: Math.max(0, (p[key] ?? 0) - 1) }))}
                                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-all"
                                    style={{ borderColor: '#e0d8cc', color: '#6b5c45' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0ebe1')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                                    <Minus size={10} />
                                  </button>
                                  <span className="w-7 text-center text-sm font-sans font-medium"
                                    style={{ color: count > 0 ? '#1e3a20' : '#9c8870' }}>
                                    {count}
                                  </span>
                                  <button type="button"
                                    onClick={() => setQty(p => ({ ...p, [key]: (p[key] ?? 0) + 1 }))}
                                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-all"
                                    style={{ borderColor: count > 0 ? '#1e3a20' : '#e0d8cc', color: count > 0 ? '#1e3a20' : '#6b5c45', backgroundColor: count > 0 ? '#f0f7f0' : 'transparent' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = count > 0 ? '#d4edcc' : '#f0ebe1')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = count > 0 ? '#f0f7f0' : 'transparent')}>
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order summary strip */}
            {totalItems > 0 && (
              <div className="rounded-2xl p-5 mb-10 flex items-center gap-4 flex-wrap"
                style={{ backgroundColor: '#d4edcc', border: '1px solid #b8dcb8' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#1e3a20' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4edcc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-medium" style={{ color: '#1e3a20' }}>
                    {totalItems} unit{totalItems !== 1 ? 's' : ''} selected across {
                      Object.values(qty).filter(v => v > 0).length
                    } product size{Object.values(qty).filter(v => v > 0).length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs font-sans mt-0.5" style={{ color: '#3d6e3e' }}>
                    Complete your business details below to submit.
                  </p>
                </div>
              </div>
            )}

            {/* Business info */}
            <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: '#fff', boxShadow: '0 4px 32px rgba(30,58,32,0.06)' }}>
              <h2 className="text-2xl mb-1" style={{ color: '#1e2d1f' }}>Business Information</h2>
              <p className="text-sm font-sans mb-8" style={{ color: '#9c8870' }}>
                Tell us about your business so we can send you wholesale pricing and terms.
              </p>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                {([
                  { label: 'Business Name', field: 'businessName', type: 'text', placeholder: 'Sage & Bloom Boutique', required: true },
                  { label: 'Contact Name', field: 'contactName', type: 'text', placeholder: 'Jane Smith', required: true },
                  { label: 'Email Address', field: 'email', type: 'email', placeholder: 'jane@yourbusiness.com', required: true },
                  { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '(555) 000-0000', required: false },
                ] as const).map(({ label, field, type, placeholder, required }) => (
                  <div key={field}>
                    <label className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                      style={{ color: '#6b5c45', letterSpacing: '0.12em' }}>
                      {label}{required && ' *'}
                    </label>
                    <input
                      required={required}
                      type={type}
                      value={info[field]}
                      onChange={e => setInfo(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#1e3a20')}
                      onBlur={e => (e.target.style.borderColor = '#e0d8cc')}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                    style={{ color: '#6b5c45', letterSpacing: '0.12em' }}>Business Type</label>
                  <select
                    value={info.businessType}
                    onChange={e => setInfo(p => ({ ...p, businessType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all appearance-none"
                    style={{ ...inputStyle, color: info.businessType ? '#1e2d1f' : '#9c8870' }}
                    onFocus={e => (e.target.style.borderColor = '#1e3a20')}
                    onBlur={e => (e.target.style.borderColor = '#e0d8cc')}>
                    <option value="">Select type...</option>
                    <option>Retail Boutique</option>
                    <option>Spa / Salon</option>
                    <option>Health & Wellness Store</option>
                    <option>Pharmacy / Apothecary</option>
                    <option>Online Retailer</option>
                    <option>Gift Shop</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                    style={{ color: '#6b5c45', letterSpacing: '0.12em' }}>State</label>
                  <input
                    type="text"
                    value={info.state}
                    onChange={e => setInfo(p => ({ ...p, state: e.target.value }))}
                    placeholder="e.g. Maryland"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#1e3a20')}
                    onBlur={e => (e.target.style.borderColor = '#e0d8cc')}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs uppercase font-sans tracking-widest mb-1.5"
                  style={{ color: '#6b5c45', letterSpacing: '0.12em' }}>Additional Notes</label>
                <textarea
                  value={info.notes}
                  onChange={e => setInfo(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any questions, special requests, or additional context..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#1e3a20')}
                  onBlur={e => (e.target.style.borderColor = '#e0d8cc')}
                />
              </div>

              {error && (
                <p className="text-sm font-sans mb-5 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: '#fde8e8', color: '#8b2020' }}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t" style={{ borderColor: '#f0ebe1' }}>
                <p className="text-xs font-sans" style={{ color: '#9c8870' }}>
                  * Required. We'll respond within 2–3 business days with pricing and terms.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3.5 rounded-full text-sm font-sans transition-all duration-200 disabled:opacity-60"
                  style={{ backgroundColor: '#1e3a20', color: '#fff', letterSpacing: '0.08em' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#a07840'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#1e3a20'; }}>
                  {submitting ? 'Submitting...' : 'Submit Wholesale Inquiry'}
                </button>
              </div>
            </div>

          </form>
        )}
      </main>

      {/* Minimal footer */}
      <footer className="mt-20 py-6 border-t" style={{ borderColor: '#e8e0d0' }}>
        <p className="text-center text-xs font-sans" style={{ color: '#9c8870' }}>
          © {new Date().getFullYear()} Bloom 5.5 by TB Naturals · Wholesale Portal ·{' '}
          <Link to="/" className="underline" style={{ color: '#a07840' }}>Back to store</Link>
        </p>
      </footer>
    </div>
  );
}
