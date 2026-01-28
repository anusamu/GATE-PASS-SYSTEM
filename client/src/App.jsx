import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Login";

import DashboardLayout from "./routes/DashboardLayout";

import DashBoard from "./pages/DashBoard";
import StaffMypass from "./pages/StaffMypass";
import StaffHistory from "./pages/StaffHistory";

import HodDashboard from "./pages/HodDashboard";
import HodHistory from "./pages/HodHistory";

import AdminDashboard from "./pages/AdminDashboard";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTE ================= */}
        <Route path="/" element={<AuthPage />} />

        {/* ================= STAFF ROUTES ================= */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashBoard />} />
          <Route path="mypass" element={<StaffMypass />} />
          <Route path="history" element={<StaffHistory />} />
        </Route>

        {/* ================= HOD ROUTES ================= */}
        <Route
          path="/hod"
          element={
            <RoleRoute role="hod">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<HodDashboard />} />
          <Route path="history" element={<HodHistory />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
