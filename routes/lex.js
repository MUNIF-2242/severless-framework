const express = require("express");

const lexController = require("../controllers/lex");

const router = express.Router();

app.post("/lex-fulfillment", async (req, res) => {
  try {
    const lexResponse = await lexController.handleLexRequest(req.body);
    res.json(lexResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
