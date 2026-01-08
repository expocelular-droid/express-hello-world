const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

// Needed for WhatsApp POST messages
app.use(bodyParser.json());

// ROOT TEST
app.get("/", (req, res) => {
  res.send("Hello from Render!");
});

// ✅ META WEBHOOK VERIFICATION (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "gtmiami_secret";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ INCOMING WHATSAPP MESSAGES (POST)
app.post("/webhook", (req, res) => {
  console.log("Incoming WhatsApp message:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




