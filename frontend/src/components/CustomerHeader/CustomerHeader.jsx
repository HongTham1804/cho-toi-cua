import '@fortawesome/fontawesome-free/css/all.min.css';
import logoMain from '../../assets/logo-main.png'; 
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DeliveryLocationModal from '../DeliveryLocationModal/DeliveryLocationModal';
import { CART_CHANGED_EVENT, getCartTotalQuantity } from '../../services/cartStorage';
import { fetchCategories, fetchProducts, fetchStores } from '../../services/productApi';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import goLogo from '../../assets/logos/GO.png';

const DEFAULT_CATEGORY = 'Tất cả sản phẩm';

const DELIVERY_LOCATION_STORAGE_KEY = 'ctc_delivery_location';

const readDeliveryLocation = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(DELIVERY_LOCATION_STORAGE_KEY));
    if (!saved || !Number.isFinite(Number(saved.lat)) || !Number.isFinite(Number(saved.lng))) {
      return null;
    }

    return {
      address: saved.address || '',
      lat: Number(saved.lat),
      lng: Number(saved.lng),
    };
  } catch {
    return null;
  }
};

const getStoreLogo = (storeName, logoUrl = '') => {
  if (storeName?.includes('WinMart') || logoUrl.includes('Winmart')) return winmartLogo;
  if (storeName?.includes('GO') || logoUrl.includes('GO')) return goLogo;
  return bachHoaXanhLogo;
};

export default function CustomerHeader({ onMenuClick, onLoginClick, onRegisterClick, variant = 'customer' }) {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
    const [stores, setStores] = useState([]);
    const [deliveryLocation, setDeliveryLocation] = useState(() => readDeliveryLocation());
    const [hasLoadedSearchData, setHasLoadedSearchData] = useState(false);
    const isGuest = variant === 'guest';
    const navigate = useNavigate();
    const location = useLocation();
    const searchWrapperRef = useRef(null);
    const storePanelRef = useRef(null);

    const scopedStoreId = useMemo(() => {
      const params = new URLSearchParams(location.search);
      const storeIdFromQuery = Number(params.get('store_id'));
      const storeIdFromState = Number(location.state?.store_id || location.state?.storeId);
      const storeId = storeIdFromQuery || storeIdFromState;

      return location.pathname === '/supermarket-details' && storeId ? storeId : null;
    }, [location.pathname, location.search, location.state]);

    const isStoreScopedSearch = Boolean(scopedStoreId);

    useEffect(() => {
      if (isGuest) {
        return undefined;
      }

      const syncCartQuantity = () => setCartQuantity(getCartTotalQuantity());
      syncCartQuantity();
      window.addEventListener(CART_CHANGED_EVENT, syncCartQuantity);
      window.addEventListener('storage', syncCartQuantity);

      return () => {
        window.removeEventListener(CART_CHANGED_EVENT, syncCartQuantity);
        window.removeEventListener('storage', syncCartQuantity);
      };
    }, [isGuest]);

    useEffect(() => {
      if (isGuest || !isAddressModalOpen || stores.length > 0) {
        return undefined;
      }

      let isMounted = true;

      fetchStores()
        .then((apiStores) => {
          if (isMounted) setStores(apiStores);
        })
        .catch(() => {
          if (isMounted) setStores([]);
        });

      return () => {
        isMounted = false;
      };
    }, [isAddressModalOpen, isGuest, stores.length]);

    useEffect(() => {
      setProducts([]);
      setCategories([DEFAULT_CATEGORY]);
      setSelectedProduct(null);
      setIsSearchDropdownOpen(false);
      setHasLoadedSearchData(false);
    }, [scopedStoreId]);

    useEffect(() => {
      if (isGuest) {
        return undefined;
      }

      const handleDocumentPointerDown = (event) => {
        if (searchWrapperRef.current?.contains(event.target)) {
          return;
        }

        setIsSearchDropdownOpen(false);
        setIsSearchFocused(false);
      };

      document.addEventListener('mousedown', handleDocumentPointerDown);
      document.addEventListener('touchstart', handleDocumentPointerDown);

      return () => {
        document.removeEventListener('mousedown', handleDocumentPointerDown);
        document.removeEventListener('touchstart', handleDocumentPointerDown);
      };
    }, [isGuest]);

    const loadSearchData = useCallback(() => {
      if (isGuest || hasLoadedSearchData) {
        return;
      }

      setHasLoadedSearchData(true);
      Promise.all([
        fetchProducts({
          storeId: scopedStoreId || undefined,
          perPage: scopedStoreId ? 40 : 200,
        }),
        fetchCategories(),
      ])
        .then(([apiProducts, apiCategories]) => {
          setProducts(apiProducts);
          setCategories([DEFAULT_CATEGORY, ...apiCategories.map((category) => category.name)]);
        })
        .catch(() => {
          setProducts([]);
          setCategories([DEFAULT_CATEGORY]);
          setHasLoadedSearchData(false);
        });
    }, [hasLoadedSearchData, isGuest, scopedStoreId]);

    const searchText = searchValue.trim().toLowerCase();
    const isSearchOpen = !isGuest && isSearchDropdownOpen && (
      Boolean(searchValue) ||
      selectedCategory !== DEFAULT_CATEGORY ||
      (isStoreScopedSearch && isSearchFocused)
    );

    const productResults = useMemo(() => {
      if (!isSearchOpen) {
        return [];
      }

      const filteredProducts = products.filter((product) => {
        const matchesName = !searchText || product.name.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === DEFAULT_CATEGORY || product.category === selectedCategory;
        return matchesName && matchesCategory;
      });

      const uniqueByName = new Map();
      filteredProducts.forEach((product) => {
        if (!uniqueByName.has(product.name)) {
          uniqueByName.set(product.name, product);
        }
      });

      return Array.from(uniqueByName.values());
    }, [isSearchOpen, products, searchText, selectedCategory]);

    const storesForSelectedProduct = useMemo(() => {
      if (!selectedProduct) {
        return [];
      }

      const availableStoreIds = new Set(
        products
          .filter((product) => product.name === selectedProduct.name)
          .map((product) => product.store_id)
      );

      const storesById = new Map();
      products.forEach((product) => {
        if (availableStoreIds.has(product.store_id) && !storesById.has(product.store_id)) {
          storesById.set(product.store_id, {
            store_id: product.store_id,
            displayName: product.storeName,
            logo: getStoreLogo(product.storeName, product.storeLogo),
            time: product.store_id === 3 ? '20-25 phút' : '15-20 phút',
          });
        }
      });

      return Array.from(storesById.values());
    }, [products, selectedProduct]);

    const handleSelectStore = (store) => {
      const productInSelectedStore = products.find(
        (product) =>
          product.name === selectedProduct?.name &&
          Number(product.store_id) === Number(store.store_id)
      ) || selectedProduct;

      setSearchValue('');
      setSelectedProduct(null);
      setIsSearchDropdownOpen(false);
      setSelectedCategory(DEFAULT_CATEGORY);
      navigate(`/product-detail/${productInSelectedStore.id}?store_id=${store.store_id}`, {
        state: {
          productId: productInSelectedStore.id,
          storeId: store.store_id,
          backToStoreUrl: `/supermarket-details?store_id=${store.store_id}`,
        },
      });
    };

    const handleSelectProduct = (product) => {
      if (isStoreScopedSearch) {
        setSearchValue('');
        setSelectedProduct(null);
        setIsSearchDropdownOpen(false);
        setSelectedCategory(DEFAULT_CATEGORY);
        navigate(`/product-detail/${product.id}?store_id=${scopedStoreId}`, {
          state: {
            productId: product.id,
            storeId: scopedStoreId,
            backToStoreUrl: `/supermarket-details?store_id=${scopedStoreId}`,
          },
        });
        return;
      }

      setSelectedProduct(product);
    };

    useEffect(() => {
      if (!selectedProduct || isStoreScopedSearch) {
        return undefined;
      }

      const scrollTimer = window.setTimeout(() => {
        storePanelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 0);

      return () => window.clearTimeout(scrollTimer);
    }, [isStoreScopedSearch, selectedProduct]);

    const handleConfirmDeliveryLocation = (nextLocation) => {
      const normalizedLocation = {
        address: nextLocation.address || '',
        lat: Number(nextLocation.lat),
        lng: Number(nextLocation.lng),
      };

      setDeliveryLocation(normalizedLocation);
      window.localStorage.setItem(
        DELIVERY_LOCATION_STORAGE_KEY,
        JSON.stringify(normalizedLocation)
      );
      setIsAddressModalOpen(false);
    };

    return (
    <header className={`header-core ${isGuest ? 'guest-header-core' : ''}`}>
      <div className="header-container">
        {!isGuest && <i className="fa-solid fa-bars menu-trigger" onClick={onMenuClick}></i>}

        <div className="header-logo">
          <img src={logoMain} alt="logo" className="logo-icon" />
          <span className="logo-text">Chợ Tới Cửa</span>
        </div>

        <div className="search-bar-wrapper" ref={searchWrapperRef}>
          {!isGuest && (
            <select
              className="search-category-select"
              value={selectedCategory}
              onChange={(event) => {
                loadSearchData();
                setSelectedCategory(event.target.value);
                setSelectedProduct(null);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => {
                loadSearchData();
                setIsSearchDropdownOpen(true);
              }}
              onClick={() => {
                loadSearchData();
                setIsSearchDropdownOpen(true);
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            className="search-input"
            value={searchValue}
            onChange={(event) => {
              loadSearchData();
              setSearchValue(event.target.value);
              setSelectedProduct(null);
              setIsSearchDropdownOpen(true);
            }}
            onFocus={() => {
              loadSearchData();
              setSelectedProduct(null);
              setIsSearchDropdownOpen(true);
              setIsSearchFocused(true);
            }}
            onBlur={() => {
              window.setTimeout(() => setIsSearchFocused(false), 160);
            }}
            onClick={() => {
              loadSearchData();
              setIsSearchDropdownOpen(true);
              setIsSearchFocused(true);
            }}
          />
          <i className="fa-solid fa-magnifying-glass search-icon"></i>

          {isSearchOpen && (
            <div className={`search-dropdown-core ${selectedProduct ? 'has-store-panel' : ''}`}>
              <div className="search-dropdown-title">Sản phẩm phù hợp</div>
              {productResults.length > 0 ? (
                <div className="search-result-list">
                  {productResults.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      className={`search-product-row ${selectedProduct?.name === product.name ? 'active' : ''}`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <img src={product.image} alt={product.name} />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.category}</small>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="search-empty-state">Không tìm thấy sản phẩm phù hợp.</p>
              )}

              {selectedProduct && !isStoreScopedSearch && (
                <div className="search-store-panel" ref={storePanelRef}>
                  <div className="search-dropdown-title">Chọn siêu thị có sản phẩm này</div>
                  <div className="search-store-list">
                    {storesForSelectedProduct.map((store) => (
                      <button
                        type="button"
                        key={store.store_id}
                        className="search-store-row"
                        onClick={() => handleSelectStore(store)}
                      >
                        <img src={store.logo} alt={store.displayName} />
                        <span>
                          <strong>{store.displayName}</strong>
                          <small>{store.time}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isGuest ? (
          <div className="guest-auth-actions-core">
            {onLoginClick ? (
              <button
                type="button"
                className="guest-auth-btn-core guest-auth-btn-core--outline"
                onClick={onLoginClick}
              >
                Đăng nhập
              </button>
            ) : (
              <Link to="/login" className="guest-auth-btn-core guest-auth-btn-core--outline">
                Đăng nhập
              </Link>
            )}
            {onRegisterClick ? (
              <button
                type="button"
                className="guest-auth-btn-core guest-auth-btn-core--solid"
                onClick={onRegisterClick}
              >
                Đăng ký
              </button>
            ) : (
              <Link to="/select-role" className="guest-auth-btn-core guest-auth-btn-core--solid">
                Đăng ký
              </Link>
            )}
          </div>
        ) : (
          <div className="header-icons">
            <div className="icon-item" onClick={() => setIsAddressModalOpen(true)}>
            <i className="fa-solid fa-location-dot"></i>
            </div>
            <Link to="/shopping-cart" className="icon-item">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartQuantity > 0 && <span className="cart-badge-core">{cartQuantity}</span>}
            </Link>
            <Link to="/notifications" className="icon-item">
              <i className="fa-solid fa-bell"></i>
            </Link>
          </div>
        )}
      </div>
      {!isGuest && isAddressModalOpen && (
        <DeliveryLocationModal
          currentLocation={deliveryLocation}
          stores={stores}
          onClose={() => setIsAddressModalOpen(false)}
          onConfirm={handleConfirmDeliveryLocation}
        />
      )}
    </header>
  );
}
