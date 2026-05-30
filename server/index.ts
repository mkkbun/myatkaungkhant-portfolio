import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? SMTP_USER;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(
  cors({
    origin: CLIENT_ORIGIN.split(",").map((o) => o.trim()),
    methods: ["POST"],
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mailConfigured: Boolean(SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL),
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body ?? {};

    if (website) {
      return res.json({ success: true });
    }

    if (!SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
      return res.status(503).json({
        error:
          "Email service is not configured. Set SMTP_USER, SMTP_PASS, and CONTACT_TO_EMAIL in .env.local.",
      });
    }

    const trimmedName = String(name ?? "").trim();
    const trimmedEmail = String(email ?? "").trim();
    const trimmedSubject = String(subject ?? "").trim();
    const trimmedMessage = String(message ?? "").trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (trimmedMessage.length > 600) {
      return res.status(400).json({ error: "Message must be 600 characters or fewer." });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailSubject = trimmedSubject
      ? `[Portfolio] ${trimmedSubject} — ${trimmedName}`
      : `[Portfolio] New message from ${trimmedName}`;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: trimmedEmail,
      subject: mailSubject,
      text: [
        `New message from your portfolio contact form`,
        ``,
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        `Subject: ${trimmedSubject || "(none)"}`,
        ``,
        `Message:`,
        trimmedMessage,
      ].join("\n"),
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}">${escapeHtml(trimmedEmail)}</a></p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject || "(none)")}</p>
        <hr />
        <p style="white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({
      error: "Could not send your message. Please try again or email directly.",
    });
  }
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("Warning: SMTP credentials missing — contact form emails will not send.");
  }
});
