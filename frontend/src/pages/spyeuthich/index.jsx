import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Grid3X3, List, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { addCartItem } from "../../services/cartStorage";
import {
  fetchFavoriteProducts,
  removeFavoriteProduct,
} from "../../services/favoriteApi";
import "./index.css";

const ALL_CATEGORIES = "Tất cả";

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const formatAddedDate = (value) => {
  if (!value) {
    return "Chưa có ngày thêm";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có ngày thêm";
  }

  return `Đã thêm ngày ${date.toLocaleDateString("vi-VN")}`;
};

export default function FavoriteProducts() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchFavoriteProducts()
      .then((items) => {
        if (!isMounted) return;
        setFavoriteItems(items);
      })
      .catch((favoriteError) => {
        if (!isMounted) return;
        setFavoriteItems([]);
        setError(favoriteError.message || "Không lấy được danh sách sản phẩm yêu thích.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set(
      favoriteItems
        .map((item) => item.category)
        .filter(Boolean)
    );

    return [ALL_CATEGORIES, ...Array.from(categorySet)];
  }, [favoriteItems]);

  const visibleItems = useMemo(() => {
    const filteredItems =
      activeCategory === ALL_CATEGORIES
        ? favoriteItems
        : favoriteItems.filter((item) => item.category === activeCategory);

    return [...filteredItems].sort((a, b) => {
      const firstTime = new Date(a.addedAt || 0).getTime();
      const secondTime = new Date(b.addedAt || 0).getTime();

      return sortMode === "recent" ? secondTime - firstTime : firstTime - secondTime;
    });
  }, [activeCategory, favoriteItems, sortMode]);

  const handleRemove = async (itemId) => {
    setError("");

    try {
      await removeFavoriteProduct(itemId);
      setFavoriteItems((items) => items.filter((item) => String(item.id) !== String(itemId)));
    } catch (removeError) {
      setError(removeError.message || "Không xóa được sản phẩm yêu thích.");
    }
  };

  const handleAddToCart = (item) => {
    addCartItem(item);
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
          <p>Xem lại và mua nhanh các sản phẩm bạn đã lưu khi xem chi tiết sản phẩm.</p>
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

        {isLoading && <div className="favorite-empty-state">Đang tải sản phẩm yêu thích...</div>}
        {error && <div className="favorite-message favorite-message--error">{error}</div>}

        {!isLoading && (
          <div className={`favorite-product-grid favorite-product-grid--${viewMode}`}>
            {visibleItems.map((item) => (
              <article className="favorite-product-card" key={item.id}>
                <Link to={`/product-detail/${item.id}`} className="favorite-product-image-wrap">
                  <img src={item.image} alt={item.name} className="favorite-product-image" />
                </Link>

                <div className="favorite-product-body">
                  <Link to={`/product-detail/${item.id}`} className="favorite-product-title-link">
                    <h2>{item.name}</h2>
                  </Link>
                  <strong className="favorite-product-price">{formatCurrency(item.price)}</strong>
                  <p className="favorite-product-date">{formatAddedDate(item.addedAt)}</p>

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
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus size={19} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && visibleItems.length === 0 && !error && (
          <div className="favorite-empty-state">
            Chưa có sản phẩm yêu thích nào. Hãy mở chi tiết sản phẩm và bấm biểu tượng trái tim để lưu lại.
          </div>
        )}
      </div>
    </section>
  );
}
