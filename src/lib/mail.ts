import nodemailer from "nodemailer";

const quoteTo = process.env.QUOTE_TO_EMAIL || "sales@pakhuis.co.za";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass },
  });
}

export async function sendQuoteEmail(data: {
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  physicalAddress?: string | null;
  projectType: string;
  tileCategory?: string | null;
  tileSize?: string | null;
  colourPreference?: string | null;
  quantityM2?: string | null;
  budgetRange?: string | null;
  deliveryOption?: string | null;
  deliveryArea?: string | null;
  notes?: string | null;
  productSlug?: string | null;
  installation: boolean;
  quoteId: string;
}) {
  const transporter = getTransporter();
  const subject = `New quote request — ${data.fullName} (${data.projectType})`;

  const text = [
    "New Pakhuis Tiles quote request",
    "",
    `Quote ID: ${data.quoteId}`,
    `Name: ${data.fullName}`,
    `Company: ${data.companyName || "—"}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Address: ${data.physicalAddress || "—"}`,
    "",
    `Project type: ${data.projectType}`,
    `Tile category: ${data.tileCategory || "—"}`,
    `Tile size: ${data.tileSize || "—"}`,
    `Colour: ${data.colourPreference || "—"}`,
    `Quantity (m²): ${data.quantityM2 || "—"}`,
    `Budget: ${data.budgetRange || "—"}`,
    `Product: ${data.productSlug || "—"}`,
    `Installation needed: ${data.installation ? "Yes" : "No"}`,
    "",
    `Delivery/collection: ${data.deliveryOption || "—"}`,
    `Delivery area: ${data.deliveryArea || "—"}`,
    "",
    "Notes:",
    data.notes || "—",
  ].join("\n");

  const html = `
    <h2>New Pakhuis Tiles quote request</h2>
    <p><strong>Quote ID:</strong> ${data.quoteId}</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(data.fullName)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(data.companyName || "—")}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone)}</td></tr>
      <tr><td><strong>Address</strong></td><td>${escapeHtml(data.physicalAddress || "—")}</td></tr>
      <tr><td><strong>Project type</strong></td><td>${escapeHtml(data.projectType)}</td></tr>
      <tr><td><strong>Tile category</strong></td><td>${escapeHtml(data.tileCategory || "—")}</td></tr>
      <tr><td><strong>Tile size</strong></td><td>${escapeHtml(data.tileSize || "—")}</td></tr>
      <tr><td><strong>Colour</strong></td><td>${escapeHtml(data.colourPreference || "—")}</td></tr>
      <tr><td><strong>Quantity (m²)</strong></td><td>${escapeHtml(data.quantityM2 || "—")}</td></tr>
      <tr><td><strong>Budget</strong></td><td>${escapeHtml(data.budgetRange || "—")}</td></tr>
      <tr><td><strong>Product</strong></td><td>${escapeHtml(data.productSlug || "—")}</td></tr>
      <tr><td><strong>Installation</strong></td><td>${data.installation ? "Yes" : "No"}</td></tr>
      <tr><td><strong>Delivery</strong></td><td>${escapeHtml(data.deliveryOption || "—")}</td></tr>
      <tr><td><strong>Area</strong></td><td>${escapeHtml(data.deliveryArea || "—")}</td></tr>
      <tr><td><strong>Notes</strong></td><td>${escapeHtml(data.notes || "—")}</td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"Pakhuis Tiles Website" <${process.env.SMTP_USER}>`,
    to: quoteTo,
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

export async function sendQuoteReplyEmail(data: {
  to: string;
  customerName: string;
  subject: string;
  message: string;
  quoteId: string;
}) {
  const transporter = getTransporter();
  const fromUser = process.env.SMTP_USER || "sales@pakhuis.co.za";
  await transporter.sendMail({
    from: `"Pakhuis Tiles Sales" <${fromUser}>`,
    to: data.to,
    cc: quoteTo,
    replyTo: fromUser,
    subject: data.subject,
    text: [
      `Hi ${data.customerName},`,
      "",
      data.message,
      "",
      "—",
      "Pakhuis Tiles",
      `Quote ref: ${data.quoteId}`,
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(data.customerName)},</p>
      <p style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escapeHtml(data.message)}</p>
      <p style="color:#666;font-size:12px">Pakhuis Tiles · Quote ref: ${escapeHtml(data.quoteId)}</p>
    `,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Pakhuis Tiles Website" <${process.env.SMTP_USER}>`,
    to: quoteTo,
    replyTo: data.email,
    subject: data.subject || `Website contact — ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      "",
      data.message,
    ].join("\n"),
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
