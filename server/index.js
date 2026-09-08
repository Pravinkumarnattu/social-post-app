const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

app.get("/", (req, res) => {
  res.send("Server running successfully");
})

app.use("/api/auth", authRoutes);

connectDB();
app.listen(process.env.PORT || 5000, () => {
  console.log(`server running at port ${process.env.PORT || 5000}`);
});
