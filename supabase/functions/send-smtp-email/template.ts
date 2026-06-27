export const html = (p: any) =>
  `<h2>Hi ${p.name},</h2><p>Your order #${p.orderId.slice(0, 8)} is confirmed.</p><h3>Total: $${p.total.toFixed(2)}</h3><h3>Items:</h3><ul>${p.items}</ul><h3>Shipping to:</h3><p>${p.shippingAddress.line1}<br>${p.shippingAddress.line2 ? `${p.shippingAddress.line2}<br>` : ""}${p.shippingAddress.city}, ${p.shippingAddress.state} ${p.shippingAddress.postal_code}</p>`;
export const wholesaleInquiryAdminHtml = (p: any) =>
  `<h2>New wholesale inquiry from ${p.businessName}</h2><ul><li><strong>Business Name:</strong> ${p.businessName}</li><li><strong>Contact Name:</strong> ${p.contactName}</li><li><strong>Email:</strong> ${p.email}</li><li><strong>Phone:</strong> ${p.phone || "n/a"}</li><li><strong>Business Type:</strong> ${p.businessType || "n/a"}</li><li><strong>State:</strong> ${p.state || "n/a"}</li><li><strong>Notes:</strong> ${p.notes || "n/a"}</li></ul><h3>Items</h3><ul>${p.items}</ul>`;
export const wholesaleInquiryConfirmationHtml = (p: any) =>
  `<p>Hi ${p.name},</p><p>Thanks for your interest in carrying Bloom 5.5. We\'ll review your order and get back to you within 2-3 business days with wholesale pricing and next steps.</p>`;
export const newsletterHtml = () =>
  `<h2>Welcome to Bloom 5.5!</h2><p>Here’s your 10% off code: <strong>WELCOME10</strong></p>`;
export const newAccountHtml = (p: any) =>
  `<h2>Welcome to Bloom 5.5${p.name ? `, ${p.name}` : ""}!</h2><p>Your account has been created successfully.</p>`;
export const passwordResetHtml = (p: any) =>
  `<h2>Password Reset</h2><p>Click the link below to reset your password:</p><p><a href="${p.link}">${p.link}</a></p>`;
