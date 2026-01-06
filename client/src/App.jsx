
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';


import AuthPage from './pages/Login';
import DashBoard from './pages/DashBoard';
import HodDashboard from './pages/HodDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffMypass from './pages/StaffMypass';
import StaffHistory from './pages/StaffHistory';


function App() {
  return (
    <BrowserRouter>
    

      <Routes>
      
     


       <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashBoard/>} /> 
        <Route path="/hod/dashboard" element={<HodDashboard/>} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard/>} /> 
        <Route path="/dashboard/Mypass" element={<StaffMypass/>} /> 
        <Route path="/dashboard/History" element={<StaffHistory/>} /> 

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
