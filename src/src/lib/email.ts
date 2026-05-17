import nodemailer from 'nodemailer'
import { formatPrice, formatDate } from './utils'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT ?? '587'),
  secure: process.env.SMTP_PORT === '465',
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

interface OrderEmailData {
  to:          string
  name:        string
  orderNumber: string
  items:       { name: string; emoji: string; quantity: number; price: number }[]
  total:       number
  deliveryCharge: number
  discount:    number
  address?: { line1: string; city: string; pincode: string } | null
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const itemsHtml = data.items.map((item) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#2C1F14;">
        ${item.emoji} ${item.name}
      </td>
      <td style="padding:8px 0;font-size:14px;color:#7A6652;text-align:center;">
        ×${item.quantity}
      </td>
      <td style="padding:8px 0;font-size:14px;color:#2C1F14;text-align:right;font-weight:600;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'DM Sans',system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:Georgia,serif;font-size:28px;color:#2C1F14;margin:0;">
        Wrap<span style="color:#E8849A;">Love</span> ✦
      </h1>
      <p style="color:#7A6652;font-size:13px;margin-top:8px;">Premium Gifting Studio</p>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:24px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(44,31,20,0.08);">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="font-size:48px;margin-bottom:12px;">🎉</div>
        <h2 style="font-family:Georgia,serif;font-size:22px;color:#2C1F14;margin:0 0 8px;">
          Order Confirmed!
        </h2>
        <p style="color:#7A6652;font-size:14px;margin:0;">
          Hey ${data.name}! We've received your order and we're getting it ready with love. 💗
        </p>
      </div>

      <!-- Order number -->
      <div style="background:#FFF5F8;border-radius:16px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="color:#7A6652;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">
          Order Number
        </p>
        <p style="font-family:Georgia,serif;font-size:20px;color:#E8849A;font-weight:600;margin:0;">
          #${data.orderNumber}
        </p>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="border-bottom:1px solid #F0EAE0;">
            <th style="text-align:left;padding:8px 0;font-size:11px;color:#7A6652;font-weight:500;text-transform:uppercase;">Item</th>
            <th style="text-align:center;padding:8px 0;font-size:11px;color:#7A6652;font-weight:500;text-transform:uppercase;">Qty</th>
            <th style="text-align:right;padding:8px 0;font-size:11px;color:#7A6652;font-weight:500;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody style="border-bottom:1px solid #F0EAE0;">${itemsHtml}</tbody>
        <tfoot>
          ${data.discount > 0 ? `<tr><td colspan="2" style="padding:6px 0;font-size:13px;color:#7A6652;">Discount</td><td style="text-align:right;font-size:13px;color:#C8D8C0;">−${formatPrice(data.discount)}</td></tr>` : ''}
          <tr>
            <td colspan="2" style="padding:6px 0;font-size:13px;color:#7A6652;">Delivery</td>
            <td style="text-align:right;font-size:13px;color:#7A6652;">${data.deliveryCharge === 0 ? 'FREE' : formatPrice(data.deliveryCharge)}</td>
          </tr>
          <tr style="border-top:1px solid #F0EAE0;">
            <td colspan="2" style="padding:12px 0 0;font-size:15px;font-weight:600;color:#2C1F14;">Total</td>
            <td style="text-align:right;padding:12px 0 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#2C1F14;">${formatPrice(data.total)}</td>
          </tr>
        </tfoot>
      </table>

      ${data.address ? `
      <!-- Delivery address -->
      <div style="background:#F0FFF5;border-radius:12px;padding:16px;margin-top:20px;">
        <p style="font-size:12px;color:#7A6652;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">
          Delivering to
        </p>
        <p style="font-size:14px;color:#2C1F14;margin:0;">
          ${data.address.line1}, ${data.address.city} ${data.address.pincode}
        </p>
      </div>` : ''}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders"
        style="display:inline-block;background:#E8849A;color:#ffffff;text-decoration:none;
               padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;">
        Track Your Order →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#7A6652;font-size:12px;">
      <p>Made with 💗 in Chennai, India</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#E8849A;">wraplove.in</a> ·
        <a href="mailto:hello@wraplove.in" style="color:#E8849A;"> hello@wraplove.in</a>
      </p>
    </div>
  </div>
</body>
</html>
  `

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM ?? 'WrapLove <hello@wraplove.in>',
    to:      data.to,
    subject: `🎁 Order Confirmed — #${data.orderNumber} | WrapLove`,
    html,
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM ?? 'WrapLove <hello@wraplove.in>',
    to,
    subject: '💗 Welcome to WrapLove!',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;background:#FAF7F2;">
        <h1 style="font-family:Georgia,serif;color:#2C1F14;">Welcome, ${name}! 🌸</h1>
        <p style="color:#7A6652;">You've joined WrapLove — India's most aesthetic gifting studio.</p>
        <p style="color:#7A6652;">Here's your welcome gift: use code <strong style="color:#E8849A;">FIRST15</strong> for 15% off your first order.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop"
          style="display:inline-block;background:#E8849A;color:#fff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:14px;margin-top:16px;">
          Start Shopping ✦
        </a>
      </div>
    `,
  })
}
