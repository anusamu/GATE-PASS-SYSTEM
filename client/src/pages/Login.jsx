import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Stack,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import SecurityIcon from "@mui/icons-material/Security";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post(`${API}/login`, loginData);

      const { token, role, name, department, email } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          department,
          role: role.toLowerCase(),
        })
      );

      localStorage.setItem("token", token);

      setMessage("Login successful");

      switch (role.toLowerCase()) {
        case "admin":
          navigate("/admin");
          break;
        case "hod":
          navigate("/hod");
          break;
        case "security":
          navigate("/Security/Dashboard");
          break;
        case "staff":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await axios.post(`${API}/register`, signup);
      setMessage("Account created successfully");
      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post(`${API}/forgot-password`, {
        email: forgotEmail,
      });

      setMessage(res.data.message || "Reset link sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ xs: 2, sm: 4 }}
      sx={{
        background: "linear-gradient(135deg,#e0f2fe,#f0fdfa)",
      }}
    >
      <Box width="100%" maxWidth={480}>
        <Paper
          elevation={16}
          sx={{
            borderRadius: "2rem",
            overflow: "hidden",
            bgcolor: "#ffffff",
          }}
        >
          {/* HEADER */}
          <Box
            textAlign="center"
            p={4}
            sx={{
              background: GRADIENT,
              color: "#fff",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#fff",
                borderRadius: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              }}
            >
              <SecurityIcon sx={{ color: "#2563eb", fontSize: 40 }} />
            </Box>

            <Typography variant="h5" fontWeight={900}>
              Gate Pass System
            </Typography>

            <Typography variant="caption" fontWeight={700}>
              {mode === "login"
                ? "SECURE LOGIN"
                : mode === "signup"
                ? "STAFF REGISTRATION"
                : "RESET PASSWORD"}
            </Typography>
          </Box>

          {/* ALERTS */}
          <Box px={4} pt={3}>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>

          {/* FORMS */}
          <Box p={4}>
            {/* LOGIN */}
            {mode === "login" && (
              <form onSubmit={handleLogin}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "#94a3b8" }} />
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <LockIcon sx={{ mr: 1, color: "#94a3b8" }} />
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      py: 1.6,
                      borderRadius: "1.25rem",
                      background: GRADIENT,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    LOGIN
                  </Button>

                  <Button onClick={() => setMode("forgot")}>
                    Forgot Password?
                  </Button>

                  {/* <Button onClick={() => setMode("signup")}>
                    New Staff? Create Account
                  </Button> */}
                </Stack>
              </form>
            )}

            {/* FORGOT PASSWORD */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    placeholder="Enter registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      py: 1.6,
                      borderRadius: "1.25rem",
                      background: GRADIENT,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    SEND RESET LINK
                  </Button>

                  <Button onClick={() => setMode("login")}>
                    Back to Login
                  </Button>
                </Stack>
              </form>
            )}

            {/* SIGNUP */}
            {mode === "signup" && (
              <form onSubmit={handleSignup}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Full Name"
                    value={signup.name}
                    onChange={(e) =>
                      setSignup({ ...signup, name: e.target.value })
                    }
                  />

                  <TextField
                    fullWidth
                    required
                    type="email"
                    placeholder="Email"
                    value={signup.email}
                    onChange={(e) =>
                      setSignup({ ...signup, email: e.target.value })
                    }
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    placeholder="Password"
                    value={signup.password}
                    onChange={(e) =>
                      setSignup({ ...signup, password: e.target.value })
                    }
                  />

                  <TextField
                    select
                    fullWidth
                    required
                    label="Department"
                    value={signup.department}
                    onChange={(e) =>
                      setSignup({ ...signup, department: e.target.value })
                    }
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="FINANCE">FINANCE</MenuItem>
                    <MenuItem value="CRM">CRM</MenuItem>
                    <MenuItem value="LEGAL">LEGAL</MenuItem>
                    <MenuItem value="ELECTRICAL">ELECTRICAL</MenuItem>
                    <MenuItem value="MEP">MEP</MenuItem>
                    <MenuItem value="CIVIL">CIVIL</MenuItem>
                  </TextField>

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      py: 1.6,
                      borderRadius: "1.25rem",
                      background: GRADIENT,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    CREATE ACCOUNT
                  </Button>

                  <Button onClick={() => setMode("login")}>
                    Back to Login
                  </Button>
                </Stack>
              </form>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default AuthPage;
