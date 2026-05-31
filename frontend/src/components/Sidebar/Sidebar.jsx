import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import "./Sidebar.scss";

const navItems = [
  { to: "/admin-dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
  { to: "/product-management", label: "Quản lý sản phẩm", icon: Package },
  { to: "/user-management", label: "Quản lý người dùng", icon: Users },
  { to: "/quanlydoitac-gia", label: "Quản lý đối tác", icon: Briefcase },
  { to: "/quanlyvanchuyen", label: "Quản lý vận chuyển", icon: Truck },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị không?")) {
      navigate("/select-role", { replace: true });
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <h1>Chợ Tới Cửa</h1>
        <p>Market Management</p>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Điều hướng quản trị">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "admin-sidebar__item active" : "admin-sidebar__item"
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "admin-sidebar__item active" : "admin-sidebar__item"
          }
        >
          <Settings size={20} />
          <span>Cài đặt</span>
        </NavLink>
        <button type="button" className="admin-sidebar__item" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
