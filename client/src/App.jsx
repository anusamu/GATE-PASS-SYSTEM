import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import HodDashboard from "./pages/HodDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffMypass from "./pages/StaffMypass";
import StaffHistory from "./pages/StaffHistory";
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import HodHistory from "./pages/HodHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<AuthPage />} />

        {/* STAFF ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/mypass"
          element={
            <PrivateRoute>
              <StaffMypass />
            </PrivateRoute>
          }
        />

        {/* <Route
          path="/history"
          element={
            <PrivateRoute>
              <StaffHistory />
            </PrivateRoute>
          }
        /> */}

<Route path="/dashboard/history" element={<StaffHistory />} />
<Route path="/hod/history" element={<HodHistory/>} />


        {/* HOD ROUTE */}
        <Route
          path="/hod/dashboard"
          element={
            <RoleRoute role="hod">
              <HodDashboard />
            </RoleRoute>
          }
        />

        {/* ADMIN ROUTE */}
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
