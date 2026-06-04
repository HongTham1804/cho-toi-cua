import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import logoMain from "../../assets/logo-main.png";

const API_BASE_URL = "http://localhost:8000/api";
const REPORT_FONT_FAMILY = '"Segoe UI", "Arial", sans-serif';

const normalizeOrders = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeApiList = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getLastPage = (payload) => Number(payload?.data?.last_page || 1);

const fetchApiList = async (path, message) => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(message);
  }

  const payload = await response.json();
  return normalizeApiList(payload);
};

const fetchAllOrders = async () => {
  const perPage = 100;
  const firstResponse = await fetch(`${API_BASE_URL}/orders?per_page=${perPage}&page=1`);

  if (!firstResponse.ok) {
    throw new Error("Không thể tải dữ liệu đơn hàng.");
  }

  const firstPayload = await firstResponse.json();
  const lastPage = getLastPage(firstPayload);
  const orders = [...normalizeOrders(firstPayload)];

  if (lastPage <= 1) return orders;

  const nextPages = Array.from({ length: lastPage - 1 }, (_, index) => index + 2);
  const pagePayloads = await Promise.all(
    nextPages.map(async (page) => {
      const response = await fetch(`${API_BASE_URL}/orders?per_page=${perPage}&page=${page}`);

      if (!response.ok) {
        throw new Error("Không thể tải đầy đủ dữ liệu đơn hàng.");
      }

      return response.json();
    })
  );

  pagePayloads.forEach((payload) => orders.push(...normalizeOrders(payload)));
  return orders;
};

const formatCurrency = (value) => {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
};

const formatPercent = (value) => {
  return `${Number(value || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 1,
  })}%`;
};

const formatCompactCurrency = (value) => {
  const amount = Number(value || 0);

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} triệu`;
  }

  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000).toLocaleString("vi-VN")} nghìn`;
  }

  return `${amount.toLocaleString("vi-VN")} VND`;
};

const getWeekdayLabel = (date) => {
  const labels = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return labels[date.getDay()];
};

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const isSameMonth = (value, date) => {
  if (!value) return false;

  const orderDate = new Date(value);
  if (Number.isNaN(orderDate.getTime())) return false;

  return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
};

const isSameDay = (value, date) => {
  if (!value) return false;

  const orderDate = startOfDay(new Date(value));
  if (Number.isNaN(orderDate.getTime())) return false;

  return orderDate.getTime() === startOfDay(date).getTime();
};

const isStoreOpenNow = (date) => date.getHours() < 22;

const getRevenueTrend = (orders, now) => {
  const today = startOfDay(now);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const revenue = orders
      .filter((order) => isSameDay(order.created_at, date))
      .reduce((total, order) => total + Number(order.subtotal || 0), 0);

    return {
      date,
      label: getWeekdayLabel(date),
      fullLabel: date.toLocaleDateString("vi-VN"),
      revenue,
      displayRevenue: formatCompactCurrency(revenue),
    };
  });

  const maxRevenue = Math.max(...days.map((day) => day.revenue), 0);

  return days.map((day) => ({
    ...day,
    height: maxRevenue > 0 ? Math.max(8, Math.round((day.revenue / maxRevenue) * 100)) : 0,
  }));
};

const getDashboardStats = ({ orders, stores, shippers, now, isLoading }) => {
  const currentMonth = now.getMonth() + 1;
  const monthlyOrders = orders.filter((order) => isSameMonth(order.created_at, now));
  const monthlyRevenue = monthlyOrders.reduce((total, order) => total + Number(order.subtotal || 0), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const totalPartners = stores.length;
  const storesAreOpen = isStoreOpenNow(now);
  const onlinePartners = storesAreOpen ? totalPartners : 0;
  const totalShippers = shippers.length;

  return [
    {
      label: "Tổng doanh thu",
      value: isLoading ? "Đang tải..." : formatCurrency(monthlyRevenue),
      note: `Tổng doanh thu tháng ${currentMonth}`,
      change: "Theo tháng",
      icon: Wallet,
      tone: "green",
    },
    {
      label: "Tổng đơn hàng",
      value: isLoading ? "Đang tải..." : totalOrders.toLocaleString("vi-VN"),
      note: `Tỷ lệ hoàn thành đơn ${formatPercent(completionRate)}`,
      change: `${completedOrders}/${totalOrders}`,
      icon: ShoppingBag,
      tone: "blue",
    },
    {
      label: "Tổng đối tác",
      value: isLoading ? "Đang tải..." : `${totalPartners.toLocaleString("vi-VN")} Đối tác`,
      note: storesAreOpen
        ? `${onlinePartners.toLocaleString("vi-VN")} siêu thị đang trực tuyến`
        : "Sau 22:00 không có đối tác đang trực tuyến",
      change: storesAreOpen ? "Trực tuyến" : "Đã đóng cửa",
      icon: Store,
      tone: "red",
    },
    {
      label: "Shipper đang online",
      value: isLoading ? "Đang tải..." : `${totalShippers.toLocaleString("vi-VN")} Shippers`,
      note: "Tổng nhân viên giao hàng trong database",
      change: "Đang hoạt động",
      icon: Users,
      tone: "emerald",
      path: "/user-management?role=shipper",
    },
  ];
};

const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const getExportDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const exportDashboardExcel = ({ stats, revenueTrend }) => {
  const statRows = stats
    .map(
      (stat) => `
        <tr>
          <td>${escapeHtml(stat.label)}</td>
          <td>${escapeHtml(stat.value)}</td>
          <td>${escapeHtml(stat.note)}</td>
          <td>${escapeHtml(stat.change)}</td>
        </tr>`
    )
    .join("");
  const trendRows = revenueTrend
    .map(
      (day) => `
        <tr>
          <td>${escapeHtml(day.fullLabel)}</td>
          <td>${escapeHtml(day.label)}</td>
          <td>${Number(day.revenue || 0)}</td>
        </tr>`
    )
    .join("");
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: "Segoe UI", Arial, sans-serif; color: #0f172a; }
          h1 { color: #047857; }
          table { border-collapse: collapse; margin-bottom: 24px; width: 100%; }
          th { background: #ecfdf5; color: #064e3b; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Chợ Tới Cửa - Báo cáo bảng điều khiển</h1>
        <p>Ngày xuất: ${escapeHtml(new Date().toLocaleString("vi-VN"))}</p>
        <h2>Thống kê tổng quan</h2>
        <table>
          <thead>
            <tr><th>Chỉ số</th><th>Giá trị</th><th>Ghi chú</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>${statRows}</tbody>
        </table>
        <h2>Xu hướng doanh thu 7 ngày gần nhất</h2>
        <table>
          <thead>
            <tr><th>Ngày</th><th>Thứ</th><th>Doanh thu trước voucher (VND)</th></tr>
          </thead>
          <tbody>${trendRows}</tbody>
        </table>
      </body>
    </html>`;

  downloadBlob(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }),
    `bao-cao-dashboard-${getExportDate()}.xls`
  );
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) => {
  const words = String(text).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);

  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
};

const setCanvasFont = (ctx, weight, size) => {
  ctx.font = `${weight} ${size}px ${REPORT_FONT_FAMILY}`;
};

const createDashboardReportCanvas = ({ stats, revenueTrend }) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 920;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#047857";
  setCanvasFont(ctx, 700, 42);
  ctx.fillText("Chợ Tới Cửa", 70, 76);
  ctx.fillStyle = "#475569";
  setCanvasFont(ctx, 400, 20);
  ctx.fillText("Market Management", 70, 108);

  ctx.fillStyle = "#475569";
  setCanvasFont(ctx, 400, 18);
  ctx.fillText("Tổng quan điều hành", 70, 155);
  ctx.fillStyle = "#0f172a";
  setCanvasFont(ctx, 800, 28);
  ctx.fillText("Chợ Tới Cửa vận hành và doanh thu thời gian thực", 70, 194);
  ctx.fillStyle = "#64748b";
  setCanvasFont(ctx, 400, 16);
  ctx.fillText(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 70, 226);

  const cardWidth = 305;
  const cardHeight = 162;
  const cardGap = 20;
  const cardY = 270;
  const cardTones = {
    green: ["#d1fae5", "#047857"],
    blue: ["#dbeafe", "#2563eb"],
    red: ["#fee2e2", "#b91c1c"],
    emerald: ["#ccfbf1", "#047857"],
  };

  stats.forEach((stat, index) => {
    const x = 70 + index * (cardWidth + cardGap);
    const [toneBg, toneText] = cardTones[stat.tone] || cardTones.green;

    ctx.fillStyle = "#ffffff";
    drawRoundedRect(ctx, x, cardY, cardWidth, cardHeight, 8);
    ctx.fill();
    ctx.strokeStyle = "#d7e0da";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = toneBg;
    drawRoundedRect(ctx, x + 22, cardY + 24, 42, 42, 5);
    ctx.fill();
    ctx.fillStyle = toneText;
    setCanvasFont(ctx, 700, 22);
    ctx.fillText("•", x + 40, cardY + 51);

    ctx.fillStyle = toneBg;
    drawRoundedRect(ctx, x + cardWidth - 108, cardY + 26, 86, 28, 5);
    ctx.fill();
    ctx.fillStyle = toneText;
    setCanvasFont(ctx, 700, 14);
    ctx.fillText(stat.change, x + cardWidth - 98, cardY + 45);

    ctx.fillStyle = "#475569";
    setCanvasFont(ctx, 800, 15);
    ctx.fillText(stat.label.toUpperCase(), x + 22, cardY + 86);
    ctx.fillStyle = "#0f172a";
    setCanvasFont(ctx, 900, 27);
    ctx.fillText(stat.value, x + 22, cardY + 120);
    ctx.fillStyle = "#64748b";
    setCanvasFont(ctx, 400, 16);
    drawWrappedText(ctx, stat.note, x + 22, cardY + 145, cardWidth - 44, 20);
  });

  const chartX = 70;
  const chartY = 515;
  const chartWidth = 1260;
  const chartHeight = 330;
  const chartBottom = chartY + chartHeight - 54;
  const chartTop = chartY + 92;
  const barMaxHeight = chartBottom - chartTop;

  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, chartX, chartY, chartWidth, chartHeight, 8);
  ctx.fill();
  ctx.strokeStyle = "#d7e0da";
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  setCanvasFont(ctx, 900, 24);
  ctx.fillText("Xu hướng doanh thu", chartX + 28, chartY + 45);
  ctx.fillStyle = "#64748b";
  setCanvasFont(ctx, 400, 16);
  ctx.fillText("Hiệu suất 7 ngày gần nhất", chartX + 28, chartY + 74);

  ctx.strokeStyle = "#eef2f7";
  ctx.beginPath();
  ctx.moveTo(chartX + 28, chartY + 95);
  ctx.lineTo(chartX + chartWidth - 28, chartY + 95);
  ctx.stroke();

  const columnWidth = (chartWidth - 80) / revenueTrend.length;
  revenueTrend.forEach((day, index) => {
    const centerX = chartX + 52 + columnWidth * index + columnWidth / 2;
    const barHeight = Math.round((day.height / 100) * barMaxHeight);
    const barY = chartBottom - barHeight;

    ctx.fillStyle = "#475569";
    setCanvasFont(ctx, 700, 13);
    ctx.textAlign = "center";
    ctx.fillText(day.displayRevenue, centerX, chartTop - 12);

    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(centerX - 44, chartBottom);
    ctx.lineTo(centerX + 44, chartBottom);
    ctx.stroke();

    if (barHeight > 0) {
      ctx.fillStyle = "#10b981";
      drawRoundedRect(ctx, centerX - 6, barY, 12, barHeight, 8);
      ctx.fill();
    }

    ctx.fillStyle = "#64748b";
    setCanvasFont(ctx, 400, 16);
    ctx.fillText(day.label, centerX, chartBottom + 32);
  });
  ctx.textAlign = "left";

  return canvas;
};

const binaryStringToUint8Array = (value) => {
  const bytes = new Uint8Array(value.length);

  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }

  return bytes;
};

const createPdfBlobFromCanvas = (canvas) => {
  const imageDataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const imageBinary = atob(imageDataUrl.split(",")[1]);
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 18;
  const imageRatio = canvas.width / canvas.height;
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;
  let drawWidth = availableWidth;
  let drawHeight = drawWidth / imageRatio;

  if (drawHeight > availableHeight) {
    drawHeight = availableHeight;
    drawWidth = drawHeight * imageRatio;
  }

  const drawX = (pageWidth - drawWidth) / 2;
  const drawY = (pageHeight - drawHeight) / 2;
  const content = `q\n${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${drawX.toFixed(2)} ${drawY.toFixed(2)} cm\n/Im1 Do\nQ`;
  const parts = [];
  const offsets = [0];
  let offset = 0;

  const add = (value) => {
    parts.push(value);
    offset += value.length;
  };

  const addObject = (body) => {
    offsets.push(offset);
    add(`${offsets.length - 1} 0 obj\n${body}\nendobj\n`);
  };

  add("%PDF-1.4\n");
  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`);
  offsets.push(offset);
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n`);
  add(imageBinary);
  add("\nendstream\nendobj\n");
  addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefOffset = offset;
  add(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((objectOffset) => {
    add(`${String(objectOffset).padStart(10, "0")} 00000 n \n`);
  });
  add(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const pdfBinary = parts.join("");
  return new Blob([binaryStringToUint8Array(pdfBinary)], { type: "application/pdf" });
};

const exportDashboardPdf = async ({ stats, revenueTrend }) => {
  await document.fonts?.ready;
  const canvas = createDashboardReportCanvas({ stats, revenueTrend });
  downloadBlob(createPdfBlobFromCanvas(canvas), `bao-cao-dashboard-${getExportDate()}.pdf`);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const loadDashboardData = async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoadingData(true);
      setDataError("");
    }

    try {
      const [nextOrders, nextStores, nextShippers] = await Promise.all([
        fetchAllOrders(),
        fetchApiList("/stores", "Không thể tải dữ liệu đối tác."),
        fetchApiList("/shippers", "Không thể tải dữ liệu shipper."),
      ]);
      setOrders(nextOrders);
      setStores(nextStores);
      setShippers(nextShippers);
    } catch (error) {
      if (!silent) setDataError(error.message || "Không thể tải dữ liệu bảng điều khiển.");
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboardData() {
      setIsLoadingData(true);
      setDataError("");

      try {
        const [nextOrders, nextStores, nextShippers] = await Promise.all([
          fetchAllOrders(),
          fetchApiList("/stores", "Không thể tải dữ liệu đối tác."),
          fetchApiList("/shippers", "Không thể tải dữ liệu shipper."),
        ]);

        if (isMounted) {
          setOrders(nextOrders);
          setStores(nextStores);
          setShippers(nextShippers);
        }
      } catch (error) {
        if (isMounted) setDataError(error.message || "Không thể tải dữ liệu bảng điều khiển.");
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadInitialDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => getDashboardStats({ orders, stores, shippers, now: new Date(), isLoading: isLoadingData }),
    [orders, stores, shippers, isLoadingData]
  );
  const revenueTrend = useMemo(() => getRevenueTrend(orders, new Date()), [orders]);

  const handleExportExcel = () => {
    setIsExportMenuOpen(false);
    exportDashboardExcel({ stats, revenueTrend });
  };

  const handleExportPdf = async () => {
    setIsExportMenuOpen(false);
    await exportDashboardPdf({ stats, revenueTrend });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <div className="dashboard-search">
            <Search size={18} className="dashboard-search-icon" aria-hidden="true" />
            <input type="text" placeholder="Tìm dữ liệu, đối tác, đơn hàng..." />
          </div>

          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={() => loadDashboardData()}
            disabled={isLoadingData}
          >
            <RefreshCw size={15} />
            {isLoadingData ? "Đang làm mới..." : "Làm mới dữ liệu"}
          </button>
        </div>

        <div className="dashboard-topbar-actions">
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">Admin</span>
            <span className="dashboard-user-role">Quản lý chợ</span>
          </div>
          <img
            className="dashboard-avatar"
            src={logoMain}
            alt="Cho Toi Cua"
          />
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-title-row">
          <div>
            <p className="dashboard-eyebrow">Tổng quan điều hành</p>
            <h1>Chợ Tới Cửa vận hành và doanh thu thời gian thực</h1>
            {dataError && <p className="dashboard-data-error">{dataError}</p>}
          </div>
          <div className="dashboard-export-wrap">
            <button
              type="button"
              className="dashboard-export-btn"
              onClick={() => setIsExportMenuOpen((current) => !current)}
              aria-expanded={isExportMenuOpen}
            >
              <Download size={15} />
              Xuất dữ liệu
            </button>
            {isExportMenuOpen && (
              <div className="dashboard-export-menu">
                <button type="button" onClick={handleExportExcel}>Xuất Excel</button>
                <button type="button" onClick={handleExportPdf}>Xuất PDF</button>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-stat-grid" aria-label="Chỉ số tổng quan">
          {stats.map(({ label, value, note, change, icon: Icon, tone, path }) => (
            <article
              className={`dashboard-stat-card ${path ? "dashboard-stat-card--clickable" : ""}`}
              key={label}
              role={path ? "button" : undefined}
              tabIndex={path ? 0 : undefined}
              onClick={path ? () => navigate(path) : undefined}
              onKeyDown={
                path
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(path);
                      }
                    }
                  : undefined
              }
            >
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
            </div>

            <div className="dashboard-bar-chart" aria-label="Biểu đồ doanh thu 7 ngày">
              {revenueTrend.map((bar) => (
                <div className="dashboard-bar-column" key={bar.fullLabel}>
                  <strong>{bar.displayRevenue}</strong>
                  <div className="dashboard-bar-track">
                    <span style={{ height: `${bar.height}%` }} />
                  </div>
                  <small>{bar.label}</small>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
