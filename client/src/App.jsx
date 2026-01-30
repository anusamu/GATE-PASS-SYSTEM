import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Login";
import DashboardLayout from "./routes/DashboardLayout";

import DashBoard from "./pages/DashBoard";
import StaffMypass from "./pages/StaffMypass";
import StaffHistory from "./pages/StaffHistory";

import HodDashboard from "./pages/HodDashboard";
import HodHistory from "./pages/HodHistory";

import AdminDashboard from "./pages/AdminDashboard";

import RoleRoute from "./routes/RoleRoute";
import Adminhistory from "./pages/Adminhistory";
import SecurityDashboard from "./pages/SecurityDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<AuthPage />} />

        {/* ================= STAFF ================= */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute role="staff">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<DashBoard />} />
          <Route path="mypass" element={<StaffMypass />} />
          <Route path="history" element={<StaffHistory />} />
        </Route>

        {/* ================= HOD ================= */}
        <Route
          path="/hod"
          element={
            <RoleRoute role="hod">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<HodDashboard />} />
          <Route path="history" element={<HodHistory />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard/>} />
          <Route path="history" element={<Adminhistory/>} />
        </Route>

    <Route
          path="/Security/Dashboard"
          element={
            <RoleRoute role="security">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<SecurityDashboard />} />
         
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
