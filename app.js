const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "gtmiami_secret";

/**
 * Meta Webhook Verification (GET)
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
 * Incoming WhatsApp Messages (POST)
 */
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

/**
 * Root test
 */
app.get("/", (req, res) => {
  res.send("Hello from Render!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





