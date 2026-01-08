const express = require("express");
const app = express();

// Root test route
app.get("/", (req, res) => {
  res.send("HELLO FROM RENDER");
});

// WhatsApp Webhook Verification (GET)
app.get("/webhook/whatsapp-verify", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Webhook verification:", { mode, token, challenge });

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

