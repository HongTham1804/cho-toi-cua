import React, { useState } from 'react';
import './index.css';
import { Search, Bell, HelpCircle, Grid, Plus, Eye, Lock, ChevronLeft, ChevronRight, UserCheck, DollarSign, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';
export default function PartnerPricing() {
  const [activeTab, setActiveTab] = useState('shopper');

  const partners = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      status: 'Online',
      statusClass: 'status-online',
      rating: '4.9 (178)',
      completedOrders: '1,450',
      isLocked: false
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0912345678',
      status: 'Offline',
      statusClass: 'status-offline',
      rating: '4.7 (85)',
      completedOrders: '892',
      isLocked: false
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0983332222',
      status: 'Đã khóa',
      statusClass: 'status-locked',
      rating: '3.2 (46)',
      completedOrders: '410',
      isLocked: true
    }
  ];

  const pricingTiers = [
    { id: 'PRICE-01', name: 'Nội thành - Giờ thường', basePrice: '25.000đ', perKm: '5.000đ', shopperShare: '80%', status: 'Đang áp dụng', statusClass: 'badge-active' },
    { id: 'PRICE-02', name: 'Nội thành - Cao điểm (17h-20h)', basePrice: '35.000đ', perKm: '6.500đ', shopperShare: '82%', status: 'Đang áp dụng', statusClass: 'badge-active' },
    { id: 'PRICE-03', name: 'Ngoại thành / Đêm muộn', basePrice: '45.000đ', perKm: '8.000đ', shopperShare: '85%', status: 'Tạm ngưng', statusClass: 'badge-inactive' },
  ];

  return (
    <div className="ctc-admin-container">
      <header className="ctc-top-header">
        <div className="ctc-search-box">
          <span className="ctc-search-icon"><Search size={16} /></span>
          <input 
            type="text" 
            placeholder="Tìm kiếm đối tác, khung giá..." 
            className="ctc-search-input"
          />
        </div>

        <div className="ctc-header-actions">
          <button className="ctc-icon-btn"><Bell size={18} /></button>
          <button className="ctc-icon-btn"><HelpCircle size={18} /></button>
          <button className="ctc-icon-btn"><Grid size={18} /></button>
          <div className="ctc-divider-v"></div>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Admin Profile" 
            className="ctc-admin-avatar"
          />
        </div>
      </header>

      <main className="ctc-main-content">
        
        {/* Module Title */}
        <div className="ctc-page-header">
          <div>
            <h1 className="ctc-page-title">Quản lý Đối tác & Bảng giá</h1>
            <p className="ctc-page-subtitle">Thiết lập biểu phí dịch vụ đi chợ, chiết khấu sàn và kiểm soát danh sách tài khoản Shopper.</p>
          </div>
          <div className="ctc-action-buttons">
            <button className="ctc-btn-secondary">
              <DollarSign size={14} /> Thay đổi chiết khấu sàn
            </button>
            <button className="ctc-btn-primary">
              <Plus size={14} /> Thêm khung giá mới
            </button>
          </div>
        </div>

        <div className="ctc-tabs-navigation">
          <button 
            onClick={() => setActiveTab('shopper')}
            className={`ctc-tab-item ${activeTab === 'shopper' ? 'ctc-tab-active' : ''}`}
          >
            Danh sách Đối tác (Shopper)
          </button>
          <button 
            onClick={() => setActiveTab('pricing')}
            className={`ctc-tab-item ${activeTab === 'pricing' ? 'ctc-tab-active' : ''}`}
          >
            Cấu hình Bảng giá Vận chuyển
          </button>
        </div>

        {activeTab === 'shopper' && (
          <div className="ctc-tab-panel">
            <div className="ctc-stats-grid">
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Tổng số đối tác</p>
                  <h3 className="ctc-stat-value">1,248</h3>
                  <span className="ctc-stat-badge ctc-badge-emerald">+12% tháng này</span>
                </div>
                <div className="ctc-stat-icon ctc-icon-green"><UserCheck size={20} /></div>
              </div>
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Đối tác đang trực tuyến</p>
                  <h3 className="ctc-stat-value">342</h3>
                </div>
                <div className="ctc-stat-icon ctc-icon-blue"><span className="ctc-text-on">ON</span></div>
              </div>
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Tài khoản tạm khóa</p>
                  <h3 className="ctc-stat-value">15</h3>
                </div>
                <div className="ctc-stat-icon ctc-icon-red"><Lock size={18} /></div>
              </div>
            </div>

            <div className="ctc-table-card">
              <div className="ctc-table-filter-bar">
                <div className="ctc-filter-group">
                  <select className="ctc-filter-select">
                    <option>Tất cả trạng thái hoạt động</option>
                  </select>
                  <select className="ctc-filter-select">
                    <option>Xếp hạng: Tất cả</option>
                  </select>
                </div>
              </div>

              <div className="ctc-table-responsive">
                <table className="ctc-data-table">
                  <thead>
                    <tr>
                      <th>Họ tên đối tác</th>
                      <th>Trạng thái hđ</th>
                      <th>Đánh giá sao</th>
                      <th>Đơn hoàn thành</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner.id} className={partner.isLocked ? 'ctc-row-locked' : ''}>
                        <td>
                          <div className="ctc-partner-profile">
                            <img 
                              src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80&sig=${partner.id}`} 
                              alt={partner.name} 
                              className="ctc-partner-avatar"
                            />
                            <div>
                              <div className="ctc-partner-name">{partner.name}</div>
                              <div className="ctc-partner-phone">{partner.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`ctc-status-badge ${partner.statusClass}`}>
                            <span className="ctc-status-dot"></span>
                            {partner.status}
                          </span>
                        </td>
                        <td className="font-medium text-slate-900">
                          <span className="ctc-star-icon">★</span> {partner.rating}
                        </td>
                        <td className="font-bold text-slate-900">{partner.completedOrders} đơn</td>
                        <td className="text-center">
                          <div className="ctc-action-cell-buttons">
                            <button className="ctc-btn-icon-action ctc-btn-view"><Eye size={15} /></button>
                            <button className={`ctc-btn-icon-action ${partner.isLocked ? 'ctc-text-red' : 'ctc-btn-lock'}`}><Lock size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              <div className="ctc-table-pagination">
                <div>Hiển thị 1-3 của 1,248 đối tác</div>
                <div className="ctc-pagination-controls">
                  <button className="ctc-page-nav-btn"><ChevronLeft size={14} /></button>
                  <button className="ctc-page-num-btn active">1</button>
                  <button className="ctc-page-num-btn">2</button>
                  <button className="ctc-page-nav-btn"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="ctc-tab-panel">
            {/* Tổng quan chỉ số giá */}
            <div className="ctc-stats-grid">
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Cước phí mở cửa chuẩn</p>
                  <h3 className="ctc-stat-value">25.000đ</h3>
                  <p className="ctc-stat-hint">Áp dụng cho phạm vi 2km đầu tiên</p>
                </div>
                <div className="ctc-stat-icon ctc-icon-amber"><DollarSign size={20} /></div>
              </div>
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Tỷ lệ chiết khấu đối tác nhận</p>
                  <h3 className="ctc-stat-value">80% - 85%</h3>
                  <span className="ctc-stat-badge ctc-badge-emerald ctc-border-green">Hệ thống tự động phân chia</span>
                </div>
                <div className="ctc-stat-icon ctc-icon-blue"><ArrowUpRight size={20} /></div>
              </div>
              <div className="ctc-stat-card">
                <div>
                  <p className="ctc-stat-label">Phụ phí hệ thống</p>
                  <h3 className="ctc-stat-value">+5.000đ</h3>
                  <p className="ctc-stat-hint">Áp dụng khi thời tiết xấu hoặc đêm khuya</p>
                </div>
                <div className="ctc-stat-icon ctc-icon-slate"><Grid size={18} /></div>
              </div>
            </div>

            {/* Danh sách cấu hình bảng giá */}
            <div className="ctc-pricing-section">
              <div className="ctc-pricing-section-header">
                <h2 className="ctc-section-title">Các khung giá đang thiết lập trên hệ thống</h2>
              </div>
              
              <div className="ctc-pricing-cards-grid">
                {pricingTiers.map((tier) => (
                  <div key={tier.id} className="ctc-pricing-card">
                    <div className="ctc-pricing-card-body">
                      <div className="ctc-tier-header">
                        <div>
                          <span className="ctc-tier-id">{tier.id}</span>
                          <h4 className="ctc-tier-name">{tier.name}</h4>
                        </div>
                        <span className={`ctc-badge-status ${tier.statusClass}`}>{tier.status}</span>
                      </div>

                      <div className="ctc-tier-details-grid">
                        <div className="ctc-detail-item">
                          <span className="ctc-detail-label">Phí mở cửa (2km đầu)</span>
                          <span className="ctc-detail-value ctc-text-large">{tier.basePrice}</span>
                        </div>
                        <div className="ctc-detail-item">
                          <span className="ctc-detail-label">Mỗi km tiếp theo</span>
                          <span className="ctc-detail-value ctc-text-large">{tier.perKm}</span>
                        </div>
                        <div className="ctc-detail-full-width">
                          <span className="ctc-share-label">Tỷ lệ Shopper nhận:</span> 
                          <span className="ctc-share-value">{tier.shopperShare}</span>
                          <span className="ctc-share-hint">Hệ thống trích thu phí sàn {100 - parseInt(tier.shopperShare)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="ctc-tier-card-actions">
                      <button className="ctc-action-btn-danger"><Trash2 size={13} /> Xóa</button>
                      <button className="ctc-action-btn-success"><Edit3 size={13} /> Chỉnh sửa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
