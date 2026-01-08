const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Transaction = require("../models/transaction");
const User = require("../models/User");

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
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    if (!method) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // Create transaction
    const tx = await Transaction.create({
      user: req.user.id,
      type: "Deposit",
      amount,
      method,
      status: "completed"
    });

    // Update user balance
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { balance: amount } }
    );

    res.json({ 
      message: "Deposit successful",
      transaction: tx
    });
  } catch (err) {
    console.error("DEPOSIT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔹 CREATE WITHDRAW */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    if (!method) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // Check if user has sufficient balance
    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Create transaction
    const tx = await Transaction.create({
      user: req.user.id,
      type: "Withdraw",
      amount,
      method,
      status: "pending"
    });

    // Update user balance
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { balance: -amount } }
    );

    res.json({ 
      message: "Withdrawal successful",
      transaction: tx
    });
  } catch (err) {
    console.error("WITHDRAW ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
