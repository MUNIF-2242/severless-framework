const express = require("express");
const lexController = require("../controllers/lex/lex");

const router = express.Router();

// Define the route for Lex fulfillment
router.post("/fulfillment", async (req, res) => {
  try {
    const lexResponse = await lexController.handleLexRequest(req.body);
    res.json(lexResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
