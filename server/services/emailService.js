const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mehndimahal.com'
const FROM_EMAIL = `"Sumii Art World" <${process.env.SMTP_USER || ADMIN_EMAIL}>`

// ── Email Templates ──────────────────────────────────────────────────────────
const adminEmailTemplate = (b) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: 'Georgia', serif; background: #FDF6EC; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #3D1A0A, #6B3020); padding: 40px; text-align: center; }
  .header h1 { color: #E8C96A; font-size: 28px; margin: 0; letter-spacing: 1px; }
  .header p { color: rgba(255,255,255,0.7); margin: 8px 0 0; }
  .body { padding: 32px; }
  .alert { background: #FEF3C7; border-left: 4px solid #C9A84C; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; color: #92400E; font-weight: bold; }
  .row { display: flex; border-bottom: 1px solid #F5E6D3; padding: 12px 0; }
  .label { color: #9E7B60; font-size: 13px; width: 140px; flex-shrink: 0; }
  .value { color: #2C1008; font-size: 14px; font-weight: 500; }
  .total { background: linear-gradient(135deg, #3D1A0A, #6B3020); color: white; padding: 20px 32px; text-align: center; }
  .total span { font-size: 32px; color: #E8C96A; font-weight: bold; }
  .footer { padding: 20px; text-align: center; color: #9E7B60; font-size: 12px; background: #FDF6EC; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>🌿 New Booking Request</h1>
    <p>You have received a new mehendi booking</p>
  </div>
  <div class="body">
    <div class="alert">⚡ Action Required: Please review and confirm this booking</div>
    <div class="row"><span class="label">Customer</span><span class="value">${b.customer_name}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${b.email}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${b.phone}</span></div>
    <div class="row"><span class="label">Design</span><span class="value">${b.design?.title || 'N/A'} (${b.design?.category || ''})</span></div>
    <div class="row"><span class="label">No. of People</span><span class="value">${b.customer_count}</span></div>
    <div class="row"><span class="label">Event Date</span><span class="value">${b.booking_date}</span></div>
    <div class="row"><span class="label">Event Time</span><span class="value">${b.booking_time}</span></div>
    <div class="row"><span class="label">Address</span><span class="value">${b.address}</span></div>
    ${b.notes ? `<div class="row"><span class="label">Notes</span><span class="value">${b.notes}</span></div>` : ''}
    <div class="row"><span class="label">Booking ID</span><span class="value">#${b.id}</span></div>
  </div>
  <div class="total">Total Amount: <span>₹${b.total_price?.toLocaleString('en-IN')}</span></div>
  <div class="footer">Sumii Art World · 123 Mehendi Lane, Jaipur · +91 99999 99999</div>
</div>
</body></html>
`

const customerEmailTemplate = (b) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: 'Georgia', serif; background: #FDF6EC; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #3D1A0A, #C9A84C); padding: 40px; text-align: center; }
  .header h1 { color: white; font-size: 28px; margin: 0; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
  .check { font-size: 56px; display: block; margin-bottom: 12px; }
  .body { padding: 32px; }
  .greeting { font-size: 20px; color: #3D1A0A; font-weight: bold; margin-bottom: 12px; }
  .desc { color: #6B4C35; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
  .row { display: flex; border-bottom: 1px solid #F5E6D3; padding: 10px 0; }
  .label { color: #9E7B60; font-size: 13px; width: 130px; flex-shrink: 0; }
  .value { color: #2C1008; font-size: 14px; font-weight: 500; }
  .total-box { background: #FDF6EC; border: 2px solid #C9A84C; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
  .total-box .amount { font-size: 32px; color: #A07830; font-weight: bold; }
  .whatsapp { display: block; background: #25D366; color: white; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 16px 0; }
  .footer { padding: 20px; text-align: center; color: #9E7B60; font-size: 12px; background: #FDF6EC; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <span class="check">✅</span>
    <h1>Booking Received!</h1>
    <p>Your mehendi booking has been confirmed</p>
  </div>
  <div class="body">
    <div class="greeting">Dear ${b.customer_name},</div>
    <div class="desc">Thank you for choosing Sumii Art World! We have received your booking request and our team will contact you shortly to finalize the details.</div>
    <div class="row"><span class="label">Booking ID</span><span class="value">#${b.id}</span></div>
    <div class="row"><span class="label">Design</span><span class="value">${b.design?.title || 'N/A'}</span></div>
    <div class="row"><span class="label">Event Date</span><span class="value">${b.booking_date} at ${b.booking_time}</span></div>
    <div class="row"><span class="label">No. of People</span><span class="value">${b.customer_count}</span></div>
    <div class="row"><span class="label">Address</span><span class="value">${b.address}</span></div>
    <div class="total-box">Total Amount<br/><span class="amount">₹${b.total_price?.toLocaleString('en-IN')}</span></div>
    <a href="https://wa.me/+919999999999" class="whatsapp">📱 WhatsApp Us for Quick Updates</a>
  </div>
  <div class="footer">Sumii Art World · hello@sumiiartworld.com · +91 99999 99999</div>
</div>
</body></html>
`

// ── Email Functions ───────────────────────────────────────────────────────────
const sendBookingEmails = async (booking) => {
  if (!process.env.SMTP_USER) { console.log('SMTP not configured, skipping emails'); return }
  await Promise.all([
    // Email to admin
    transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🌿 New Booking: ${booking.customer_name} – ${booking.booking_date}`,
      html: adminEmailTemplate(booking),
    }),
    // Confirmation to customer
    transporter.sendMail({
      from: FROM_EMAIL,
      to: booking.email,
      subject: `✅ Booking Confirmed – Sumii Art World`,
      html: customerEmailTemplate(booking),
    }),
  ])
}

const sendContactEmail = async ({ name, email, phone, message }) => {
  if (!process.env.SMTP_USER) return
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `📩 Contact Form: ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong><br>${message}</p>`,
  })
}

module.exports = { sendBookingEmails, sendContactEmail }
