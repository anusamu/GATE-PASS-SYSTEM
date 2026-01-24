require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./db/connection");

const app = express();

/* =====================
   DATABASE CONNECTION
===================== */
connectDB();

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());
app.use(morgan("dev"));

/* =====================
   CORS CONFIGURATION
   (Frontend URL)
===================== */
const FRONTEND_URL = process.env.APP_URL ;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

/* =====================
   ROUTES
===================== */
app.use("/api/auth", require("./routes/auth.routes"));

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed frontend: ${FRONTEND_URL}`);
});
