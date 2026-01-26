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


// const API = "https://gate-pass-system-drti.onrender.com" || "http://localhost:5000/"
const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
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

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post(`${API}/login`, loginData);
      const { token, role, name, department,email } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      if (department) localStorage.setItem("department", department);

      setMessage("Login successful");

      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "hod":
          navigate("/hod/dashboard");
          break;
        case "security":
           navigate("/security/dashboard");
          break;
        case "staff":
          navigate("/dashboard");
          break;
        default:
          navigate("/login");
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

            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ opacity: 0.9 }}
            >
              {mode === "login" ? "SECURE LOGIN" : "STAFF REGISTRATION"}
            </Typography>
          </Box>

          {/* ALERTS */}
          <Box px={4} pt={3}>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>

          {/* FORMS */}
          <Box p={4}>
            {mode === "login" ? (
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
                      setLoginData({ ...loginData, password: e.target.value })
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

                  <Button onClick={() => setMode("signup")}>
                    New Staff? Create Account
                  </Button>
                </Stack>
              </form>
            ) : (
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
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
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
