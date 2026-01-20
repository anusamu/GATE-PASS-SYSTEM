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


// app.use(cors({
//   origin:"http://localhost:5173",
//   origin:process.env.API,
  
// }));

app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/admin", require("./routes/admin.routes"));
// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});
