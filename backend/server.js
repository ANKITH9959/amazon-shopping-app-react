const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const twilio = require("twilio");

const envPath = path.resolve(__dirname, ".env");
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.warn(`Warning: failed to load .env from ${envPath}.`);
}

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID?.trim();
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN?.trim();
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER?.trim();
const MOCK_SMS = process.env.MOCK_SMS?.toLowerCase() === "true";

const isPlaceholderSid = /^ACx+$/i.test(TWILIO_ACCOUNT_SID || "");
const isPlaceholderToken = /^x+$/i.test(TWILIO_AUTH_TOKEN || "");
const hasTwilioConfig = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) && !isPlaceholderSid && !isPlaceholderToken;
const useMockSms = MOCK_SMS || !hasTwilioConfig;

if (!hasTwilioConfig) {
  console.warn("\n⚠️  Twilio is not fully configured or is using placeholder credentials.");
  console.warn("   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER in backend/.env.");
  console.warn("   If you want to test locally without Twilio, set MOCK_SMS=true in backend/.env.\n");
}

const app = express();

app.use(cors());
app.use(express.json());

console.log("\n============================================================");
console.log("🚀 Starting backend server");
console.log("ENV PATH:", envPath);
console.log("TWILIO CONFIGURED:", hasTwilioConfig ? "YES" : "NO");
console.log("MOCK SMS MODE:", useMockSms ? "ENABLED" : "DISABLED");
console.log("TWILIO PHONE NUMBER:", TWILIO_PHONE_NUMBER || "(missing)");
console.log("============================================================\n");

/* =========================
   TWILIO CONFIG
========================= */
const client = useMockSms
  ? null
  : twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "running",
    twilioConfigured: hasTwilioConfig,
    mockSms: useMockSms,
    sendSmsEndpoint: "/send-sms"
  });
});

/* =========================
   SEND SMS API
========================= */
app.post("/send-sms", async (req, res) => {
  try {
    const { phone, product, price } = req.body;

    console.log("📩 REQUEST:", req.body);

    if (!phone || !product) {
      return res.status(400).json({
        success: false,
        message: "Missing phone or product",
      });
    }

    if (useMockSms) {
      console.log("🤖 MOCK SMS SENT:", {
        to: phone,
        from: TWILIO_PHONE_NUMBER || "(unset)",
        body: `🛒 ORDER CONFIRMED\nProduct: ${product}\nPrice: ₹${price}`,
      });

      return res.json({
        success: true,
        mock: true,
        message: "SMS send mocked because Twilio is not configured.",
      });
    }

    const message = await client.messages.create({
      body: `🛒 ORDER CONFIRMED\nProduct: ${product}\nPrice: ₹${price}`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log("✅ SMS SENT:", message.sid);

    res.json({
      success: true,
      sid: message.sid,
    });

  } catch (error) {
    console.log("❌ ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});