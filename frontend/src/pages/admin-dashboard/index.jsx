import "./index.css";
import {
  Download,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  {
    label: "Tổng doanh thu",
    value: "1,250,000,000 VND",
    note: "so với tháng trước",
    change: "+12%",
    icon: Wallet,
    tone: "green",
  },
  {
    label: "Tổng đơn hàng",
    value: "15,420",
    note: "Tỷ lệ hoàn thành đơn 98%",
    change: "+5.4%",
    icon: ShoppingBag,
    tone: "blue",
  },
  {
    label: "Tổng đối tác",
    value: "84 Đối tác",
    note: "Siêu thị đang hoạt động",
    change: "Trực tuyến",
    icon: Store,
    tone: "red",
  },
  {
    label: "Shipper đang online",
    value: "156 Shippers",
    note: "Trên 12 quận nội thành",
    change: "Đang hoạt động",
    icon: Users,
    tone: "emerald",
  },
];

const revenueBars = [
  { day: "Thứ 2", height: 52 },
  { day: "Thứ 3", height: 38 },
  { day: "Thứ 4", height: 72 },
  { day: "Thứ 5", height: 64 },
  { day: "Thứ 6", height: 78 },
  { day: "Thứ 7", height: 84 },
  { day: "Chủ Nhật", height: 55 },
];

const topPartners = [
  {
    name: "Co.op Mart Quận 1",
    orders: "432 đơn hàng hôm nay",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&auto=format&fit=crop&q=80",
  },
  {
    name: "VinMart Thảo Điền",
    orders: "315 đơn hàng hôm nay",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1543168256-418811576931?w=80&auto=format&fit=crop&q=80",
  },
  {
    name: "Lotte Mart Quận 7",
    orders: "298 đơn hàng hôm nay",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=80&auto=format&fit=crop&q=80",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <div className="dashboard-search">
            <Search size={18} className="dashboard-search-icon" aria-hidden="true" />
            <input type="text" placeholder="Tìm dữ liệu, đối tác, đơn hàng..." />
          </div>

          <button type="button" className="dashboard-refresh-btn">
            <RefreshCw size={15} />
            Làm mới dữ liệu
          </button>
        </div>

        <div className="dashboard-topbar-actions">
          <img
            className="dashboard-avatar"
            src="https://ui-avatars.com/api/?name=Admin&background=047857&color=fff"
            alt="Admin"
          />
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-title-row">
          <div>
            <p className="dashboard-eyebrow">Tổng quan điều hành</p>
            <h1>Chợ Tới Cửa vận hành và doanh thu thời gian thực</h1>
          </div>
          <button type="button" className="dashboard-export-btn">
            <Download size={15} />
            Xuất dữ liệu
          </button>
        </section>

        <section className="dashboard-stat-grid" aria-label="Chỉ số tổng quan">
          {stats.map(({ label, value, note, change, icon: Icon, tone }) => (
            <article className="dashboard-stat-card" key={label}>
              <div className="dashboard-stat-top">
                <span className={`dashboard-stat-icon dashboard-stat-icon--${tone}`}>
                  <Icon size={18} />
                </span>
                <span className={`dashboard-stat-change dashboard-stat-change--${tone}`}>
                  {change}
                </span>
              </div>
              <p>{label}</p>
              <strong>{value}</strong>
              <span>{note}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-main-grid">
          <article className="dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h2>Xu hướng doanh thu</h2>
                <p>Hiệu suất 7 ngày gần nhất</p>
              </div>
              <div className="dashboard-segmented">
                <button type="button" className="active">Doanh thu</button>
                <button type="button">Đơn hàng</button>
              </div>
            </div>

            <div className="dashboard-bar-chart" aria-label="Biểu đồ doanh thu 7 ngày">
              {revenueBars.map((bar) => (
                <div className="dashboard-bar-column" key={bar.day}>
                  <div className="dashboard-bar-track">
                    <span style={{ height: `${bar.height}%` }} />
                  </div>
                  <small>{bar.day}</small>
                </div>
              ))}
            </div>
          </article>

          <aside className="dashboard-partner-card">
            <div className="dashboard-card-header">
              <h2>Đối tác hàng đầu</h2>
              <button type="button" className="dashboard-link-btn">Xem tất cả</button>
            </div>

            <div className="dashboard-partner-list">
              {topPartners.map((partner) => (
                <div className="dashboard-partner-item" key={partner.name}>
                  <img src={partner.image} alt={partner.name} />
                  <div>
                    <strong>{partner.name}</strong>
                    <span>{partner.orders}</span>
                  </div>
                  <b>{partner.rating}</b>
                </div>
              ))}
            </div>

            <button type="button" className="dashboard-add-partner-btn">
              + Thêm đối tác mới
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}
