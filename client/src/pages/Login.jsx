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

const API = "http://localhost:5000/api/auth";

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

    const { token, role, name, department } = res.data;

    // ✅ Store auth data
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    if (department) {
      localStorage.setItem("department", department);
    }

    setMessage("Login successful");

    // 🔁 ROLE BASED NAVIGATION
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;

      case "hod":
        navigate("/hod/dashboard");
        break;

      case "security":
        navigate("/dashboard");
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
    await axios.post(`${API}/register`, {
      name: signup.name,
      email: signup.email,
      password: signup.password,
      department: signup.department,
    });

    setMessage("Account created successfully");
    setMode("login");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <Box
      minHeight="100vh"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ xs: 2, sm: 4, md: 6 }}
      sx={{
        background:
          "linear-gradient(135deg, #e0f2fe, #ecfeff, #f0fdf4)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 12s ease infinite",
      }}
    >
      {/* Gradient Animation */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <Box width="100%" maxWidth={{ xs: 380, sm: 440, md: 520 }}>
        <Paper
          elevation={14}
          sx={{
            borderRadius: { xs: "1.75rem", md: "2.5rem" },
            overflow: "hidden",
            border: "1px solid #fff",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <Box
            textAlign="center"
            p={{ xs: 4, md: 5 }}
            sx={{
              background:
                "linear-gradient(135deg, #93c5fd, #86efac)",
            }}
          >
            <Box
              sx={{
                width: { xs: 64, md: 80 },
                height: { xs: 64, md: 80 },
                bgcolor: "#fff",
                borderRadius: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                transform: "rotate(-6deg)",
              }}
            >
              <SecurityIcon
                sx={{ color: "#2563eb", fontSize: { xs: 32, md: 40 } }}
              />
            </Box>

            <Typography variant="h5" fontWeight={900} color="white">
              Gate Pass System
            </Typography>

            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "#e0f2fe" }}
            >
              {mode === "login" ? "SECURE LOGIN" : "STAFF REGISTRATION"}
            </Typography>
          </Box>

          {/* Alerts */}
          <Box px={{ xs: 3, md: 4 }} pt={3}>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>

          {/* Forms */}
          <Box p={{ xs: 3, md: 5 }}>
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
                        <EmailIcon sx={{ mr: 1, color: "#9ca3af" }} />
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
                        <LockIcon sx={{ mr: 1, color: "#9ca3af" }} />
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      py: 2,
                      borderRadius: "1.25rem",
                      background:
                        "linear-gradient(135deg, #60a5fa, #34d399)",
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
        py: 2,
        borderRadius: "1.25rem",
        background:
          "linear-gradient(135deg, #60a5fa, #34d399)",
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
