import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './pages/register'
import Login from './pages/login'
import Notifications from './pages/notifications'
import OrderHistory from './pages/order-history'
import Review from './pages/review'
import Tracking from './pages/tracking'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/review" element={<Review />} />
      <Route path="/tracking" element={<Tracking />} />
    </Routes>
  )
}

export default App
