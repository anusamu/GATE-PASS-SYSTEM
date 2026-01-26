require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./db/connection");

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://gate-pass-system-kappa.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions)); // ✅ this is enough

app.use("/", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
