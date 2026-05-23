import React, { useState } from 'react';
import Sidebar from "./components/Sidebar/Sidebar"; 
import Header from "./components/Header/Header";
import ProductManagement from './pages/ProductManagement/ProductManagement'; 
import "./App.css";
﻿import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import RegisterStore from './pages/register-store'
import Login from './pages/login'
import Notifications from './pages/notifications'
import OrderHistory from './pages/order-history'
import Review from './pages/review'
import Tracking from './pages/tracking'
import OrderManagement from './pages/order-management'
import LoggedInHomepage from './pages/logged-in-homepage'
import SupermarketDetails from './pages/supermarket-details' 

﻿import React from 'react';
import PartnerLogin from './pages/PartnerLogin/PartnerLogin'; // Đảm bảo đúng đường dẫn đến file component của bạn

function App() {
  return (
    <div className="App">
      <PartnerLogin />
    </div>
  );
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register-store" element={<RegisterStore />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/review" element={<Review />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/logged-in-homepage" element={<LoggedInHomepage />} />
      <Route path="/supermarket-details" element={<SupermarketDetails />} />
    </Routes>
  
}

export default App;