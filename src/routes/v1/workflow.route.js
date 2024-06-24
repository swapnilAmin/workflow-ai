const express = require("express");
const { route } = require("..");
const router = express.Router();

router.post("/schedule/:workflow_id");
router.post("/whatsapp", async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From;

  // Extract user information from the incoming message
  const user = {
    mobile_no: from.replace("whatsapp:", ""),
    email: "user@example.com", // Replace with actual logic to get user email
  };

  // Process the received message
  await processWhatsAppMessage({ body: message }, user);

  res.send("<Response></Response>");
});

module.exports = route;
