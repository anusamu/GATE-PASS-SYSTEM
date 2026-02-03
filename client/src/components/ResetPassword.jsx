import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${API}/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired link");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" mb={2}>
          Reset Password
        </Typography>

        {message && <Typography color="green">{message}</Typography>}
        {error && <Typography color="red">{error}</Typography>}

        <form onSubmit={handleReset}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            margin="normal"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
