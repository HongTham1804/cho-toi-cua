import { FiChevronDown, FiSearch } from "react-icons/fi";
import logoMain from "../../assets/logo-main.png";
import "./Header.scss";

const Header = ({
  searchTerm = "",
  onSearchChange,
  placeholder = "Tìm kiếm theo tên hoặc mã...",
  categoryLabel = "Danh mục:",
  categoryValue = "Tất cả danh mục",
  categories = ["Tất cả danh mục"],
  onCategoryChange,
  showCategoryFilter = true,
}) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <div className="search-box">
          <FiSearch className="icon-search" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </div>

        {showCategoryFilter && (
          <div className="category-filter">
            <span>{categoryLabel}</span>
            <div className="dropdown">
              <select
                value={categoryValue}
                onChange={(event) => onCategoryChange?.(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FiChevronDown className="icon-chevron" />
            </div>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Quản lý chợ</span>
          </div>
          <img src={logoMain} alt="Chợ Tới Cửa" className="avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
