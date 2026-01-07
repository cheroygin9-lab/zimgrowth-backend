const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Transaction = require("../models/transaction");

/* 🔹 GET ALL USER TRANSACTIONS */
router.get("/", auth, async (req, res) => {
  try {
    const tx = await Transaction
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(tx);
  } catch (err) {
    console.error("TX FETCH ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔹 CREATE DEPOSIT */
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount, method } = req.body;

    const tx = await Transaction.create({
      user: req.user.id,
      type: "Deposit",
      amount,
      method
    });

    res.json(tx);
  } catch (err) {
    console.error("DEPOSIT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔹 CREATE WITHDRAW */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount, method } = req.body;

    const tx = await Transaction.create({
      user: req.user.id,
      type: "Withdraw",
      amount,
      method
    });

    res.json(tx);
  } catch (err) {
    console.error("WITHDRAW ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
