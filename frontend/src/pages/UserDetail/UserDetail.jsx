import React, { useState } from 'react';
import { 
  FiEdit2, 
  FiRefreshCw, 
  FiLock, 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiPlus, 
  FiMinus, 
  FiArrowRight, 
  FiShoppingCart, 
  FiXCircle,
  FiEye,
  FiClock,
  FiLogIn,
  FiAlertTriangle,
  FiChevronDown,
  FiUnlock
} from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BiDollar } from 'react-icons/bi';
import './UserDetail.scss';

const UserDetail = () => {
  // --- 1. KHAI BÁO CÁC STATE QUẢN LÝ TRẠNG THÁI ---
  const [isLocked, setIsLocked] = useState(false); // Trạng thái khóa tài khoản
  const [points, setPoints] = useState(2450);      // Trạng thái điểm thưởng

  // --- 2. CÁC HÀM XỬ LÝ SỰ KIỆN (HANDLERS) ---
  
  // Hàm xử lý Khóa/Mở khóa người dùng
  const handleToggleLockStatus = () => {
    if (!isLocked) {
      const confirmLock = window.confirm("Bạn có chắc chắn muốn KHÓA tài khoản người dùng này không?");
      if (confirmLock) setIsLocked(true);
    } else {
      setIsLocked(false);
      alert("Đã mở khóa tài khoản thành công!");
    }
  };

  // Hàm xử lý Đặt lại mật khẩu
  const handleResetPassword = () => {
    const confirmReset = window.confirm("Hệ thống sẽ gửi email chứa liên kết đặt lại mật khẩu cho người dùng. Bạn xác nhận chứ?");
    if (confirmReset) {
      alert("Đã gửi email đặt lại mật khẩu thành công!");
    }
  };

  // Hàm xử lý Chỉnh sửa hồ sơ (Tạm thời hiện Alert)
  const handleEditProfile = () => {
    alert("Tính năng mở Modal/Popup Chỉnh sửa hồ sơ đang được phát triển...");
  };

  // Hàm xử lý Cộng điểm
  const handleAddPoints = () => {
    const addValue = prompt("Nhập số điểm bạn muốn CỘNG thêm:", "100");
    const numericValue = parseInt(addValue, 10);
    
    if (!isNaN(numericValue) && numericValue > 0) {
      setPoints(prevPoints => prevPoints + numericValue);
    } else if (addValue !== null) {
      alert("Vui lòng nhập một số hợp lệ lớn hơn 0!");
    }
  };

  // Hàm xử lý Trừ điểm
  const handleSubtractPoints = () => {
    const subValue = prompt("Nhập số điểm bạn muốn TRỪ:", "100");
    const numericValue = parseInt(subValue, 10);
    
    if (!isNaN(numericValue) && numericValue > 0) {
      if (numericValue > points) {
        alert("Số điểm trừ không được lớn hơn số điểm hiện tại!");
      } else {
        setPoints(prevPoints => prevPoints - numericValue);
      }
    } else if (subValue !== null) {
      alert("Vui lòng nhập một số hợp lệ lớn hơn 0!");
    }
  };

  return (
    <div className="user-detail-page">
      
      {/* =========================================
          HEADER BAR
          ========================================= */}
      <div className="header-bar">
        <div className="title-group">
          <p className="breadcrumb">Quản lý người dùng <span>&gt;</span> <strong>Chi tiết người dùng</strong></p>
          <h1>Phạm Minh Hoàng</h1>
          <div className="status-row">
            {/* Đổi Badge dựa theo State isLocked */}
            {isLocked ? (
              <span className="badge-active" style={{ background: '#FDE8E8', color: '#A43A3A' }}>
                <FiXCircle className="icon-badge" /> KHÁCH HÀNG BỊ KHÓA
              </span>
            ) : (
              <span className="badge-active">
                <BsCheckCircleFill className="icon-badge" /> KHÁCH HÀNG ĐANG HOẠT ĐỘNG
              </span>
            )}
            <span className="uid">UID: #CTC-992834</span>
          </div>
        </div>
        
        <div className="actions">
          <button className="btn-edit" onClick={handleEditProfile}>
            <FiEdit2 /> Chỉnh sửa hồ sơ
          </button>
          
          <button className="btn-reset" onClick={handleResetPassword}>
            <FiRefreshCw /> Đặt lại mật khẩu
          </button>
          
          {/* Nút Khóa sẽ đổi icon và text khi tài khoản bị khóa */}
          <button 
            className="btn-lock" 
            onClick={handleToggleLockStatus}
            style={isLocked ? { background: '#64748B', borderColor: '#64748B' } : {}}
          >
            {isLocked ? <><FiUnlock /> Mở khóa tài khoản</> : <><FiLock /> Khóa người dùng</>}
          </button>
        </div>
      </div>

      {/* =========================================
          MAIN CONTENT GRID
          ========================================= */}
      <div className="content-grid">
        
        {/* === CỘT TRÁI === */}
        <div className="left-column">
          
          {/* 1. Card Thông tin cá nhân */}
          <div className="card profile-card" style={isLocked ? { opacity: 0.6 } : {}}>
            <div className="avatar-wrapper">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
              <div className="verified-badge" style={isLocked ? { color: '#64748B' } : {}}>
                {isLocked ? <FiXCircle /> : <BsCheckCircleFill />}
              </div>
            </div>
            
            <div className="profile-name">
              <h3>Phạm Minh Hoàng</h3>
              <p className="subtitle">Thành viên Premium từ tháng 02/2023</p>
            </div>
            
            <div className="info-list">
              <div className="info-item full-width">
                <div className="icon-box"><FiMapPin /></div>
                <div className="info-text">
                  <strong>ĐỊA CHỈ CHÍNH</strong>
                  <span>24/7 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh</span>
                </div>
              </div>
              
              <div className="info-row-2col">
                <div className="info-item">
                  <div className="icon-box"><FiCalendar /></div>
                  <div className="info-text">
                    <strong>NGÀY SINH</strong>
                    <span>15/08/1994</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon-box"><FiUser /></div>
                  <div className="info-text">
                    <strong>GIỚI TÍNH</strong>
                    <span>Nam</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="points-box">
              <div className="points-header">
                <span className="label">Điểm thưởng</span>
                {/* Format số điểm với dấu phẩy phân cách */}
                <span className="value">{points.toLocaleString('vi-VN')} <span>điểm</span></span>
              </div>
              <div className="btn-group">
                <button onClick={handleAddPoints} disabled={isLocked}><FiPlus /> Cộng</button>
                <button onClick={handleSubtractPoints} disabled={isLocked}><FiMinus /> Trừ</button>
              </div>
            </div>
          </div>

          {/* 2. Card Trạng thái hiện tại */}
          <div className="card tier-card" style={isLocked ? { filter: 'grayscale(100%)' } : {}}>
            <div className="tier-content">
              <span className="status-label">TRẠNG THÁI HIỆN TẠI</span>
              <h3>Đối tác hạng Vàng</h3>
              
              <div className="progress-section">
                <p>Hạng kế tiếp: Bạch kim</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="arrow-btn">
              <FiArrowRight />
            </div>
            <div className="bg-circle">
              <div className="inner-star">★</div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI === */}
        <div className="right-column">
          {/* Lưới Thống Kê */}
          <div className="stats-row">
            <div className="card stat-card">
              <div className="stat-header">
                <div className="icon-wrapper green-bg"><BiDollar /></div>
                <span>Tổng chi tiêu</span>
              </div>
              <h3>12.500.000đ</h3>
              <p className="stat-subtext trend-up">↑ 12% so với tháng trước</p>
            </div>

            <div className="card stat-card">
              <div className="stat-header">
                <div className="icon-wrapper blue-bg"><FiShoppingCart /></div>
                <span>Tổng đơn hàng</span>
              </div>
              <h3>48 đơn</h3>
              <p className="stat-subtext">Trung bình 4 đơn/tháng</p>
            </div>

            <div className="card stat-card">
              <div className="stat-header">
                <div className="icon-wrapper red-bg"><FiXCircle /></div>
                <span>Đã hủy/Trả hàng</span>
              </div>
              <h3>3 đơn</h3>
              <p className="stat-subtext trend-down">Tỷ lệ trả hàng thấp (6%)</p>
            </div>
          </div>

          {/* Table Lịch sử */}
          <div className="card history-table-card">
            <div className="card-header">
              <h3>Lịch sử mua hàng gần đây</h3>
              <a href="#/" className="view-all">Xem tất cả</a>
            </div>
            
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="order-id">#CTC-ORD-11202</td>
                  <td>24/10/2023</td>
                  <td><strong>450.000đ</strong></td>
                  <td><span className="status-badge success">Đã giao</span></td>
                  <td><FiEye className="action-icon" onClick={() => alert('Xem chi tiết đơn hàng #CTC-ORD-11202')} /></td>
                </tr>
                <tr>
                  <td className="order-id">#CTC-ORD-11185</td>
                  <td>19/10/2023</td>
                  <td><strong>1.230.000đ</strong></td>
                  <td><span className="status-badge success">Đã giao</span></td>
                  <td><FiEye className="action-icon" onClick={() => alert('Xem chi tiết đơn hàng #CTC-ORD-11185')} /></td>
                </tr>
                <tr>
                  <td className="order-id">#CTC-ORD-10942</td>
                  <td>12/10/2023</td>
                  <td><strong>890.000đ</strong></td>
                  <td><span className="status-badge danger">Đã hủy</span></td>
                  <td><FiEye className="action-icon" onClick={() => alert('Xem chi tiết đơn hàng #CTC-ORD-10942')} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nhật ký hoạt động tài khoản */}
          <div className="card activity-log-card">
            <div className="log-header">
              <div className="header-left">
                <FiClock className="clock-icon" />
                <h3>Nhật ký hoạt động tài khoản</h3>
              </div>
              <span className="last-active">Hoạt động lần cuối: 2 giờ trước</span>
            </div>
            
            <div className="activity-list">
              <div className="activity-item">
                <div className="icon-wrapper blue-bg"><FiLogIn /></div>
                <div className="activity-content">
                  <div className="activity-title">
                    <h4>Đăng nhập thành công</h4>
                    <span className="time">Hôm nay, 09:42 AM</span>
                  </div>
                  <p>Đã đăng nhập vào hệ thống từ ứng dụng di động</p>
                  <span className="ip-badge normal">IP Address: 114.12.88.232 (HCMC, VN)</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="icon-wrapper red-bg"><FiAlertTriangle /></div>
                <div className="activity-content">
                  <div className="activity-title">
                    <h4>Sai mật khẩu</h4>
                    <span className="time">Hôm qua, 15:30 PM</span>
                  </div>
                  <p>Nhiều lần thử đăng nhập sai từ địa chỉ IP không xác định</p>
                  <span className="ip-badge alert">IP Address: 185.122.2.14 (Amsterdam, NL)</span>
                </div>
              </div>
            </div>

            <div className="log-footer">
              <button onClick={() => alert('Tải thêm dữ liệu nhật ký cũ...')}>
                XEM THÊM HOẠT ĐỘNG CŨ <FiChevronDown />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetail;