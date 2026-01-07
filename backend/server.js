console.log("🔥 server.js loaded");
require("dotenv").config();
console.log("MONGO:", process.env.MONGO_URI);

const userRoutes = require("./routes/User");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/transactions", require("./routes/transactions"));



app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => {
    console.error("MongoDB connection failed ❌");
    console.error(err.message);
  });


app.get("/", (req, res) => {
  res.send("ZimGrow backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
console.log("Transactions routes loaded");
console.log("MONGO:", process.env.MONGO_URI);
app.use("/api/transactions", require("./routes/transactions"));
app.listen(PORT,"0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
require("./models/User");
require("./models/transaction");
