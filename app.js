const express = require("express");
const app = express();

// Needed to read JSON bodies (POST)
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gtmiami_secret";

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

  console.error("❌ Verification failed");
  return res.sendStatus(403);
});

/**
 * INCOMING WHATSAPP EVENTS (POST)
 */
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook:");
  console.log(JSON.stringify(req.body, null, 2));

  // Always respond 200 to Meta
  res.sendStatus(200);
});

/**
 * ROOT (just to test Render is alive)
 */
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Proxy is running ✅");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});







