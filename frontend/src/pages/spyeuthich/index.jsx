import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Grid3X3, List, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import "./index.css";

const initialFavoriteItems = [
  {
    id: 1,
    name: "Bó rau cải xanh Đà Lạt (500g)",
    price: "15.000đ",
    image:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500&auto=format&fit=crop&q=80",
    category: "Rau củ",
    savedAt: "Mua 2 ngày trước",
    sortOrder: 2,
  },
  {
    id: 2,
    name: "Thịt ba rọi heo VietGAP (300g)",
    price: "85.000đ",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=80",
    category: "Thịt cá",
    savedAt: "Mua 1 tuần trước",
    sortOrder: 7,
  },
  {
    id: 3,
    name: "Thùng 48 hộp Sữa tươi tiệt trùng TH true MILK",
    price: "380.000đ",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80",
    category: "Sữa & Bơ",
    savedAt: "Mua 12 ngày trước",
    sortOrder: 12,
  },
  {
    id: 4,
    name: "Táo Envy Mỹ size lớn (Gói 1kg)",
    price: "199.000đ",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=80",
    category: "Trái cây",
    savedAt: "Mua 4 ngày trước",
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Gạo ST25 Ông Cua (Túi 5kg)",
    price: "165.000đ",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    category: "Đồ khô",
    savedAt: "Mua 1 tháng trước",
    sortOrder: 30,
  },
];

const categories = ["Tất cả", "Rau củ", "Thịt cá", "Trái cây", "Đồ khô", "Sữa & Bơ"];

export default function FavoriteProducts() {
  const [favoriteItems, setFavoriteItems] = useState(initialFavoriteItems);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("recent");

  const visibleItems = useMemo(() => {
    const filteredItems =
      activeCategory === "Tất cả"
        ? favoriteItems
        : favoriteItems.filter((item) => item.category === activeCategory);

    return [...filteredItems].sort((a, b) =>
      sortMode === "recent" ? a.sortOrder - b.sortOrder : b.sortOrder - a.sortOrder
    );
  }, [activeCategory, favoriteItems, sortMode]);

  const handleRemove = (itemId) => {
    setFavoriteItems((items) => items.filter((item) => item.id !== itemId));
  };

  const toggleSortMode = () => {
    setSortMode((currentMode) => (currentMode === "recent" ? "oldest" : "recent"));
  };

  return (
    <section className="favorite-products-page">
      <div className="favorite-products-container">
        <div className="favorite-breadcrumb">
          <Link to="/logged-in-homepage">Trang chủ</Link>
          <span>/</span>
          <strong>Sản phẩm yêu thích</strong>
        </div>

        <header className="favorite-page-heading">
          <h1>Sản phẩm yêu thích</h1>
          <p>Xem lại và mua nhanh các món đồ yêu thích bạn đã từng chọn tại các siêu thị.</p>
        </header>

        <div className="favorite-toolbar">
          <div className="favorite-category-list" aria-label="Lọc danh mục sản phẩm yêu thích">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`favorite-category-btn ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="favorite-view-actions">
            <button
              type="button"
              className={`favorite-sort-btn ${sortMode === "recent" ? "active" : ""}`}
              onClick={toggleSortMode}
            >
              <SlidersHorizontal size={14} />
              {sortMode === "recent" ? "Gần đây nhất" : "Cũ nhất"}
            </button>
            <div className="favorite-view-toggle" aria-label="Chế độ hiển thị">
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                aria-label="Hiển thị dạng lưới"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                aria-label="Hiển thị dạng danh sách"
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={`favorite-product-grid favorite-product-grid--${viewMode}`}>
          {visibleItems.map((item) => (
            <article className="favorite-product-card" key={item.id}>
              <div className="favorite-product-image-wrap">
                <img src={item.image} alt={item.name} className="favorite-product-image" />
              </div>

              <div className="favorite-product-body">
                <h2>{item.name}</h2>
                <strong className="favorite-product-price">{item.price}</strong>
                <p className="favorite-product-date">{item.savedAt}</p>

                <div className="favorite-card-actions">
                  <button
                    type="button"
                    className="favorite-delete-btn"
                    aria-label={`Xóa ${item.name} khỏi sản phẩm yêu thích`}
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                  <button
                    type="button"
                    className="favorite-add-cart-btn"
                    aria-label={`Thêm ${item.name} vào giỏ hàng`}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="favorite-empty-state">
            Không có sản phẩm yêu thích nào trong danh mục này.
          </div>
        )}
      </div>
    </section>
  );
}
