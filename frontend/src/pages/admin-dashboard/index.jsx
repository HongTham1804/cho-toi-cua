import React, { useState } from 'react';
import './index.css';
import { 
  LayoutGrid, ShoppingCart, Box, Users, BarChart3, Settings, 
  LogOut, Search, Bell, HelpCircle, MoreVertical, TrendingUp, 
  DollarSign, ShoppingBag, UserCheck, AlertTriangle 
} from 'lucide-react';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Tổng quan');

  const menuItems = [
    { name: 'Tổng quan', icon: <LayoutGrid size={20} /> },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20} /> },
    { name: 'Kho hàng', icon: <Box size={20} /> },
    { name: 'Người dùng', icon: <Users size={20} /> },
    { name: 'Báo cáo', icon: <BarChart3 size={20} /> },
    { name: 'Cài đặt', icon: <Settings size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar - Theo hình số 6 */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>Chợ Tới Cửa</h2>
          <p>Hệ thống Quản trị</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item logout">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header - Theo hình số 1/2 */}
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm đơn hàng, khách hàng..." />
          </div>
          
          <div className="header-actions">
            <Bell size={20} className="action-icon" />
            <HelpCircle size={20} className="action-icon" />
            <LayoutGrid size={20} className="action-icon" />
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin&background=047857&color=fff" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content - Theo hình số 4 */}
        <div className="content-body">
          <div className="page-title">
            <h1>Tổng quan hệ thống</h1>
            <p>Cập nhật tình hình kinh doanh trong ngày hôm nay.</p>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <span>Doanh thu hôm nay</span>
                <h3>45.2M ₫</h3>
                <p className="trend positive"><TrendingUp size={12} /> +12.6%</p>
              </div>
              <div className="metric-icon icon-emerald"><DollarSign /></div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span>Đơn hàng mới</span>
                <h3>128</h3>
                <p className="trend positive"><TrendingUp size={12} /> +5 đơn</p>
              </div>
              <div className="metric-icon icon-blue"><ShoppingBag /></div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span>Shopper đang HĐ</span>
                <h3>42<small>/50</small></h3>
                <div className="progress-bar"><div className="fill" style={{width: '84%'}}></div></div>
              </div>
              <div className="metric-icon icon-orange"><UserCheck /></div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span>Khách hàng mới</span>
                <h3>36</h3>
                <p className="trend negative">Tăng trưởng ổn định</p>
              </div>
              <div className="metric-icon icon-purple"><Users /></div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-container main-chart">
              <div className="chart-header">
                <h4>Doanh thu 7 ngày gần nhất</h4>
                <button className="btn-text">Chi tiết</button>
              </div>
              <div className="mock-bar-chart">
                {/* Giả lập biểu đồ cột */}
                {[40, 60, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="bar-wrapper">
                    <div className="bar" style={{height: `${h}%`}}></div>
                    <span>T{i+2}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-container side-chart">
              <h4>Tỷ trọng theo Siêu thị</h4>
              <div className="mock-donut-chart">
                <div className="donut">
                  <div className="inner-text">
                    <strong>128</strong>
                    <span>Tổng đơn</span>
                  </div>
                </div>
              </div>
              <ul className="chart-legend">
                <li><span className="dot coop"></span> Co.opmart (45%)</li>
                <li><span className="dot bigc"></span> Big C (30%)</li>
                <li><span className="dot lotte"></span> Lotte Mart (25%)</li>
              </ul>
            </div>
          </div>

          {/* Recent Orders & Urgent Alerts */}
          <div className="bottom-grid">
            <div className="recent-orders card">
              <div className="card-header">
                <h4>Đơn hàng mới nhất</h4>
                <button className="btn-text">Xem tất cả</button>
              </div>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#ORD-9821</td>
                    <td>Nguyễn Văn A</td>
                    <td>850.000₫</td>
                    <td><span className="status pending">Chờ nhận</span></td>
                  </tr>
                  <tr>
                    <td>#ORD-9820</td>
                    <td>Trần Thị B</td>
                    <td>1.250.000₫</td>
                    <td><span className="status shipping">Đang giao</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="urgent-alerts card">
              <div className="card-header">
                <h4><AlertTriangle size={16} color="#ef4444" /> Yêu cầu hỗ trợ gấp</h4>
              </div>
              <div className="alert-item">
                <p><strong>#ORD-9750</strong>: Khách báo Shopper lấy thiếu hàng.</p>
                <button className="btn-primary-sm">Xử lý ngay</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

