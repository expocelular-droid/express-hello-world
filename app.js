const express = require("express");
const app = express();

// Needed to read JSON bodies (for POST later)
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gtmiami_secret";

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Proxy is running ✅");
});

/**
 * META WEBHOOK VERIFICATION (GET)
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
});

/**
 * WHATSAPP INCOMING MESSAGES (POST)
 */
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



