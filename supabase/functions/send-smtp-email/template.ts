export const text = ({
  orderId,
  name,
  total,
  items,
  shippingAddress,
}: {
  orderId: string;
  name: string;
  total: string;
  items: string;
  shippingAddress: string;
}) => `Your Bloom 5.5 order is confirmed!

Order ID: ${orderId}
Name: ${name}
Total: ${total}

Items:
${items}

Shipping to:
${shippingAddress}

Thank you for your purchase!
`;

export const html = ({
  orderId,
  name,
  total,
  items,
  shippingAddress,
}: {
  orderId: string;
  name: string;
  total: string;
  items: string;
  shippingAddress: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bloom 5.5 Order Confirmation</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0; background-color: #fbf8f1; color: #1e2d1f; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; }
    h1 { color: #a07840; }
    p { line-height: 1.6; }
    .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #9c8870; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bloom 5.5 Order Confirmation</h1>
    <p>Hi ${name},</p>
    <p>Thank you for your order! We've received it and will start processing it right away.</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Total:</strong> ${total}</p>
    <h2>Items</h2>
    <ul>${items}</ul>
    <h2>Shipping to</h2>
    <p>${shippingAddress}</p>
    <div class="footer">
      <p>Bloom 5.5 &copy; 2024</p>
    </div>
  </div>
</body>
</html>
`;

export const wholesaleInquiryAdminText = ({
  businessName,
  contactName,
  email,
  phone,
  businessType,
  state,
  notes,
  items,
}: {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  state: string;
  notes: string;
  items: string;
}) => `New wholesale inquiry from ${businessName}.

Business Name: ${businessName}
Contact Name: ${contactName}
Email: ${email}
Phone: ${phone}
Business Type: ${businessType}
State: ${state}
Notes: ${notes}

Items:
${items}
`;

export const wholesaleInquiryAdminHtml = ({
  businessName,
  contactName,
  email,
  phone,
  businessType,
  state,
  notes,
  items,
}: {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  state: string;
  notes: string;
  items: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Wholesale Inquiry</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0; background-color: #fbf8f1; color: #1e2d1f; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; }
    h1 { color: #a07840; }
    p { line-height: 1.6; }
    .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #9c8870; }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Wholesale Inquiry</h1>
    <p><strong>Business Name:</strong> ${businessName}</p>
    <p><strong>Contact Name:</strong> ${contactName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Business Type:</strong> ${businessType}</p>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Notes:</strong> ${notes}</p>
    <h2>Items</h2>
    <ul>${items}</ul>
  </div>
</body>
</html>
`;

export const wholesaleInquiryConfirmationText = ({
  name,
}: {
  name: string;
}) => `Hi ${name},

Thank you for your wholesale inquiry! We've received your request and will get back to you within 2-3 business days with pricing and next steps.

Bloom 5.5
`;

export const wholesaleInquiryConfirmationHtml = ({
  name,
}: {
  name: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wholesale Inquiry Confirmation</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0; background-color: #fbf8f1; color: #1e2d1f; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; }
    h1 { color: #a07840; }
    p { line-height: 1.6; }
    .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #9c8870; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Wholesale Inquiry Received!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for your interest in carrying Bloom 5.5. We'll review your order and reach out within 2–3 business days with wholesale pricing and next steps.</p>
    <div class="footer">
      <p>Bloom 5.5 &copy; 2024</p>
    </div>
  </div>
</body>
</html>
`;
