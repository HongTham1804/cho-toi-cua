import React, { Suspense, useState } from "react";
import { Outlet, Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Header/Header";
import CustomerHeader from "./components/CustomerHeader/CustomerHeader";
import Footer from "./components/Footer/Footer";
import UserManagement from "./pages/UserManagement/UserManagement";
import RegisterStore from "./pages/register-store";
import Notifications from "./pages/notifications";
import OrderHistory from "./pages/order-history";
import OrderDetail from "./pages/order-detail";
import Review from "./pages/review";
import Tracking from "./pages/tracking";
import OrderManagement from "./pages/order-management";
import Inventory from "./pages/inventory";
import ProductDetail from "./pages/product-detail";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import GuestHomepage from "./pages/guest-homepage";
import LoggedInHomepage from "./pages/logged-in-homepage";
import SupermarketDetails from "./pages/supermarket-details";
import PartnerLogin from "./pages/PartnerLogin/PartnerLogin";
import ShoppingCart from "./pages/shopping-cart";
import SelectRole from "./pages/select-role";
import UserDetail from "./pages/UserDetail/UserDetail";
import AccountSettings from './pages/account-settings';

const AdminDashboard = React.lazy(() => import("./pages/admin-dashboard"));
const DeliveryManagement = React.lazy(() => import("./pages/quanlyvanchuyen"));
const PartnerPricing = React.lazy(() => import("./pages/quanlydoitac-gia"));
const FavoriteProducts = React.lazy(() => import("./pages/spyeuthich"));

const lazyPage = (Page) => (
  <Suspense fallback={<div className="route-loading">Dang tai...</div>}>
    <Page />
  </Suspense>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    
    if (isConfirmed) {
      setIsMenuOpen(false); // Đóng sidebar lại
      navigate('/select-role', { replace: true }); //Có giao diện tran chủ chưa đăng nhập thì đổi lại 
    }
  };
  const CustomerLayout = () => (
    <div className="customer-layout">
      <CustomerHeader onMenuClick={() => setIsMenuOpen(true)} />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );

  const AdminLayout = () => (
    <div className="admin-container">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );

  return (
    <div className="App">
      {isMenuOpen && (
        <div className="modal-overlay-core" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-modal-core" onClick={(event) => event.stopPropagation()}>
            <div className="user-profile-core">
              <i className="fa-solid fa-user-circle"></i>
              <h3>Chào, Khách hàng</h3>
            </div>
            <nav className="menu-links-core">
              <Link to="/logged-in-homepage" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-house"></i> Cửa hàng
              </Link>
              <Link to="/order-history" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-receipt"></i> Đơn hàng của bạn
              </Link>
              <Link to="/account-settings" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-gear"></i> Cài đặt tài khoản
              </Link>
              <a href="#" className="logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </a>
            </nav>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<GuestHomepage />} />
        <Route path="/guest-homepage" element={<GuestHomepage />} />

        <Route element={<CustomerLayout />}>
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/supermarket-details" element={<SupermarketDetails />} />
          <Route path="/logged-in-homepage" element={<LoggedInHomepage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-history/:orderId" element={<OrderDetail />} />
          <Route path="/order-detail" element={<OrderDetail />} />
          <Route path="/order-detail/:orderId" element={<OrderDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/order-management" element={<OrderManagement />} />
        </Route>

        <Route path="/login" element={<GuestHomepage initialAuth="login" />} />
        <Route path="/partner-login" element={<PartnerLogin />} />
        <Route path="/register-store" element={<RegisterStore />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/admin-dashboard" element={lazyPage(AdminDashboard)} />
        <Route path="/quanlyvanchuyen" element={lazyPage(DeliveryManagement)} />
        <Route path="/delivery-management" element={lazyPage(DeliveryManagement)} />
        <Route path="/pricing-config" element={lazyPage(PartnerPricing)} />
        <Route path="/quanlydoitac-gia" element={lazyPage(PartnerPricing)} />
        <Route path="/spyeuthich" element={lazyPage(FavoriteProducts)} />
        <Route path="/favorite-products" element={lazyPage(FavoriteProducts)} />
        <Route path="/UserDetail" element={<UserDetail />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/user-management" element={<UserManagement />} /> 
        <Route path="/product-management" element={<ProductManagement />} />
      </Routes>
    </div>
  );
}

export default App;
