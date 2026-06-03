import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import CustomerHeader from "./components/CustomerHeader/CustomerHeader";
import Footer from "./components/Footer/Footer";
import GuestHomepage from "./pages/guest-homepage";
import PartnerLogin from "./pages/PartnerLogin/PartnerLogin";
import AdminLogin from "./pages/admin-login";
import SelectRole from "./pages/select-role";
import { clearAuthSession, fetchCurrentUser, getStoredAuthUser } from "./services/authApi";
import { getAdminToken } from "./services/adminAuthApi";

const UserManagement = React.lazy(() => import("./pages/UserManagement/UserManagement"));
const Notifications = React.lazy(() => import("./pages/notifications"));
const OrderHistory = React.lazy(() => import("./pages/order-history"));
const OrderDetail = React.lazy(() => import("./pages/order-detail"));
const Review = React.lazy(() => import("./pages/review"));
const Tracking = React.lazy(() => import("./pages/tracking"));
const OrderManagement = React.lazy(() => import("./pages/order-management"));
const Inventory = React.lazy(() => import("./pages/inventory"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail/ProductDetail"));
const ProductManagement = React.lazy(() => import("./pages/ProductManagement/ProductManagement"));
const LoggedInHomepage = React.lazy(() => import("./pages/logged-in-homepage"));
const SupermarketDetails = React.lazy(() => import("./pages/supermarket-details"));
const ShoppingCart = React.lazy(() => import("./pages/shopping-cart"));
const WalletPage = React.lazy(() => import("./pages/wallet"));
const UserDetail = React.lazy(() => import("./pages/UserDetail/UserDetail"));
const AccountSettings = React.lazy(() => import("./pages/account-settings"));
const AdminDashboard = React.lazy(() => import("./pages/admin-dashboard"));
const DeliveryManagement = React.lazy(() => import("./pages/quanlyvanchuyen"));
const PartnerPricing = React.lazy(() => import("./pages/quanlydoitac-gia"));
const FavoriteProducts = React.lazy(() => import("./pages/spyeuthich"));

const lazyPage = (Page) => (
  <Suspense fallback={<div className="route-loading">Dang tai...</div>}>
    <Page />
  </Suspense>
);

function ProductDetailRedirect() {
  const { id } = useParams();
  return <Navigate to={`/product-detail/${id}`} replace />;
}

function CustomerLayout({ onMenuClick }) {
  return (
    <div className="customer-layout">
      <CustomerHeader onMenuClick={onMenuClick} />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
}

function AdminProtectedRoute() {
  return getAdminToken() ? <Outlet /> : <Navigate to="/admin-login" replace />;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getStoredAuthUser());
  const navigate = useNavigate();

  const toggleCustomerMenu = () => {
    setCurrentUser(getStoredAuthUser());
    setIsMenuOpen((current) => !current);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    let isMounted = true;

    fetchCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(getStoredAuthUser());
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isMenuOpen]);

  const handleLogout = (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    
    if (isConfirmed) {
      clearAuthSession();
      setCurrentUser(null);
      setIsMenuOpen(false); // Đóng sidebar lại
      navigate('/select-role', { replace: true }); //Có giao diện tran chủ chưa đăng nhập thì đổi lại 
    }
  };

  const customerGreetingName = currentUser?.name || "Khách hàng";

  return (
    <div className="App">
      {isMenuOpen && (
        <div className="modal-overlay-core" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-modal-core" onClick={(event) => event.stopPropagation()}>
            <div className="user-profile-core">
              <i className="fa-solid fa-user-circle"></i>
              <h3>Chào, {customerGreetingName}</h3>
            </div>
            <nav className="menu-links-core">
              <Link to="/logged-in-homepage" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-house"></i> Cửa hàng
              </Link>
              <Link to="/order-history" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-receipt"></i> Đơn hàng của bạn
              </Link>
              <Link to="/wallet" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-wallet"></i> Ví Chợ Tới Cửa
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
        <Route path="/select-role" element={<SelectRole />} />

        <Route element={<CustomerLayout onMenuClick={toggleCustomerMenu} />}>
          <Route path="/shopping-cart" element={lazyPage(ShoppingCart)} />
          <Route path="/supermarket-details" element={lazyPage(SupermarketDetails)} />
          <Route
            path="/logged-in-homepage"
            element={(
              <Suspense fallback={<div className="route-loading">Dang tai...</div>}>
                <LoggedInHomepage onAccountClick={toggleCustomerMenu} />
              </Suspense>
            )}
          />
          <Route path="/order-history" element={lazyPage(OrderHistory)} />
          <Route path="/order-history/:orderId" element={lazyPage(OrderDetail)} />
          <Route path="/order-detail" element={lazyPage(OrderDetail)} />
          <Route path="/order-detail/:orderId" element={lazyPage(OrderDetail)} />
          <Route path="/notifications" element={lazyPage(Notifications)} />
          <Route path="/wallet" element={lazyPage(WalletPage)} />
          <Route path="/review" element={lazyPage(Review)} />
          <Route path="/account-settings" element={lazyPage(AccountSettings)} />
          <Route path="/favorite-products" element={lazyPage(FavoriteProducts)} />
        </Route>

        <Route path="/tracking" element={lazyPage(Tracking)} />
        <Route path="/product/:id" element={<ProductDetailRedirect />} />
        <Route path="/product-detail" element={lazyPage(ProductDetail)} />
        <Route path="/product-detail/:id" element={lazyPage(ProductDetail)} />

        {/* Partner routes */}
        <Route path="/order-management" element={lazyPage(OrderManagement)} />
        <Route path="/order-mangement" element={lazyPage(OrderManagement)} />
        <Route path="/order-mangagement" element={lazyPage(OrderManagement)} />
        <Route path="/order-managment" element={lazyPage(OrderManagement)} />
        <Route path="/partner-login" element={<PartnerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/inventory" element={lazyPage(Inventory)} />
       
        {/* Admin routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={lazyPage(AdminDashboard)} />
            <Route path="/product-management" element={lazyPage(ProductManagement)} />
            <Route path="/user-management" element={lazyPage(UserManagement)} />
            <Route path="/quanlydoitac-gia" element={lazyPage(PartnerPricing)} />
            <Route path="/quanlyvanchuyen" element={lazyPage(DeliveryManagement)} />
          </Route>
        </Route>
        <Route path="/UserDetail" element={lazyPage(UserDetail)} />
        <Route path="/inventory" element={lazyPage(Inventory)} />
      </Routes>
    </div>
  );
}
export default App;
