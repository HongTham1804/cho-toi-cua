import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import RegisterStore from './pages/register-store'
import Login from './pages/login'
import Notifications from './pages/notifications'
import OrderHistory from './pages/order-history'
import Review from './pages/review'
import Tracking from './pages/tracking'
import OrderManagement from './pages/order-management'
import Inventory from './pages/inventory'
import ProductDetail from './pages/product-detail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register-store" element={<RegisterStore />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/review" element={<Review />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  )
}

export default App
