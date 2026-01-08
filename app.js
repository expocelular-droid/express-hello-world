const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== CONFIG =====
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gtmiami_secret";
const N8N_POST_WEBHOOK =
  "https://automation.gt-miami.com/webhook/whatsapp-incoming";

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.status(200).send("WhatsApp Webhook Proxy is running ✅");
});

// ===== META WEBHOOK VERIFICATION (GET) =====
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  }

  console.error("❌ Webhook verification failed");
  return res.sendStatus(403);
});

// ===== INCOMING WHATSAPP MESSAGES (POST) =====
app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Incoming WhatsApp event");
    console.log(JSON.stringify(req.body, null, 2));

    // Forward payload to n8n
    await fetch(N8N_POST_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Meta requires FAST 200 OK
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error forwarding to n8n", err);
    res.sendStatus(500);
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


