
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';


import AuthPage from './pages/Login';
import DashBoard from './pages/DashBoard';
import PassCard from './components/PassCard';
import HodDashboard from './pages/HodDashboard';


function App() {
  return (
    <BrowserRouter>
    

      <Routes>
        
     
       
         <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashBoard/>} /> 
        <Route path="/hod/dashboard" element={<HodDashboard/>} />

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
