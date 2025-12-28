const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db/connection');
// Initialize app
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
