const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const CACHE_PREFIX = 'ctc-api-cache:';

const readCache = (key) => {
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(`${CACHE_PREFIX}${key}`));
    if (!cached || cached.expiresAt < Date.now()) return null;
    return cached.value;
  } catch {
    return null;
  }
};

const writeCache = (key, value, ttlMs) => {
  try {
    window.sessionStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({ value, expiresAt: Date.now() + ttlMs })
    );
  } catch {
    // Cache is only a speed-up. If storage is blocked/full, API calls still work.
  }
};

const clearCacheContaining = (text) => {
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX) && key.includes(text))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Ignore storage errors.
  }
};

export const clearVoucherCache = () => {
  clearCacheContaining('vouchers:');
  clearCacheContaining('user-vouchers:');
};

const cachedRequest = async (key, ttlMs, request) => {
  const cached = readCache(key);
  if (cached) return cached;

  const value = await request();
  writeCache(key, value, ttlMs);
  return value;
};

const CATEGORY_NAME_MAP = {
  'Sữa các loại': 'Sữa, đồ uống giải khát',
  'Rau - Củ - Trái Cây': 'Rau củ quả',
  'Hóa Phẩm - Tẩy rửa': 'Hóa phẩm, tẩy rửa',
  'Chăm Sóc Cá Nhân': 'Chăm sóc cá nhân',
  'Thịt - Hải Sản Tươi': 'Thịt, Cá, Hải sản',
  'Bánh Kẹo': 'Bánh kẹo, thực phẩm khô',
};

const STORAGE_RULES = {
  'Sữa, đồ uống giải khát': 'Bảo quản nhiệt độ không quá 25°C',
  'Rau củ quả': '18 - 25°C',
  'Hóa phẩm, tẩy rửa': '15 - 25°C',
  'Chăm sóc cá nhân': '15 - 25°C',
  'Thịt, Cá, Hải sản': '0 - 4°C trong 1 - 2 ngày',
  'Bánh kẹo, thực phẩm khô': '18 - 25°C',
};

const normalizePageItems = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

const mapCategoryName = (categoryName) => CATEGORY_NAME_MAP[categoryName] || categoryName || 'Tất cả sản phẩm';

export const mapApiProduct = (product) => {
  const flashSalePrice = product.is_flash_sale && product.flash_sale_price
    ? Number(product.flash_sale_price)
    : null;
  const discountPrice = flashSalePrice || (product.discount_price ? Number(product.discount_price) : null);
  const price = discountPrice || Number(product.price);
  const originalPrice = discountPrice ? Number(product.original_price || product.price) : null;
  const category = mapCategoryName(product.category?.name);

  return {
    id: String(product.id),
    store_id: Number(product.store_id),
    storeName: product.store?.name || '',
    storeLogo: product.store?.logo_url || '',
    name: product.name,
    category,
    category_id: Number(product.category_id),
    price,
    originalPrice,
    unit: product.unit || '1 sản phẩm',
    stock: Number(product.stock || 0),
    description: product.description || '',
    storage: STORAGE_RULES[category] || 'Bảo quản nơi khô ráo, thoáng mát',
    image: resolveImageUrl(product.image_url),
    flashSale: Boolean(flashSalePrice || discountPrice),
    isFlashSale: Boolean(flashSalePrice),
    flashSalePrice,
    flashSaleSoldPercent: product.flash_sale_sold_percent ?? null,
    flashSaleRemaining: product.flash_sale_remaining ?? null,
    flashSaleEndTime: product.flash_sale_end_time ?? null,
    sequence: Number(product.id),
  };
};

export const fetchProducts = async ({ storeId, search, perPage = 40 } = {}) => {
  const params = new URLSearchParams({ per_page: String(perPage) });

  if (storeId) params.set('store_id', String(storeId));
  if (search) params.set('search', search);

  const cacheKey = `products:${params.toString()}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không lấy được sản phẩm từ backend');
  }

  const payload = await response.json();
  const products = normalizePageItems(payload).map(mapApiProduct);
  writeCache(cacheKey, products, 2 * 60 * 1000);
  return products;
};

export const fetchProductById = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error('Không lấy được chi tiết sản phẩm từ backend');
  }

  const payload = await response.json();
  return mapApiProduct(payload.data);
};

export const fetchStores = async () => {
  const cached = readCache('stores');
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/stores`);

  if (!response.ok) {
    throw new Error('Không lấy được siêu thị từ backend');
  }

  const payload = await response.json();
  const stores = normalizePageItems(payload);
  writeCache('stores', stores, 10 * 60 * 1000);
  return stores;
};

export const fetchCategories = async () => {
  const cached = readCache('categories');
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('Không lấy được danh mục từ backend');
  }

  const payload = await response.json();
  const categories = normalizePageItems(payload).map((category) => ({
    id: Number(category.id),
    name: CATEGORY_NAME_MAP[category.name] || category.name,
  }));
  writeCache('categories', categories, 10 * 60 * 1000);
  return categories;
};

export const fetchVouchers = async ({ storeId, userId } = {}) => {
  const params = new URLSearchParams();

  if (storeId) params.set('store_id', String(storeId));
  if (userId) params.set('user_id', String(userId));

  const cacheKey = `vouchers:${params.toString()}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/vouchers?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không lấy được voucher từ backend');
  }

  const payload = await response.json();
  const vouchers = normalizePageItems(payload);
  writeCache(cacheKey, vouchers, 30 * 1000);
  return vouchers;
};

export const saveVoucher = async ({ voucherId, userId }) => {
  const response = await fetch(`${API_BASE_URL}/vouchers/${voucherId}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không lưu được voucher');
  }

  clearVoucherCache();
  return payload.data;
};

export const unsaveVoucher = async ({ voucherId, userId }) => {
  const response = await fetch(`${API_BASE_URL}/vouchers/${voucherId}/save`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không bỏ lưu được voucher');
  }

  clearVoucherCache();
  return payload.data;
};

export const fetchUserVouchers = async ({ userId, storeId } = {}) => {
  const params = new URLSearchParams();

  if (userId) params.set('user_id', String(userId));
  if (storeId) params.set('store_id', String(storeId));

  const cacheKey = `user-vouchers:${params.toString()}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/user-vouchers?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không lấy được ví voucher');
  }

  const payload = await response.json();
  const vouchers = normalizePageItems(payload);
  writeCache(cacheKey, vouchers, 30 * 1000);
  return vouchers;
};

export const fetchFlashSales = async ({ storeId, status = 'active' } = {}) => {
  const params = new URLSearchParams();

  if (storeId) params.set('store_id', String(storeId));
  if (status) params.set('status', status);

  const cacheKey = `flash-sales:${params.toString()}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/flash-sales?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không lấy được flash sale');
  }

  const payload = await response.json();
  const flashSales = normalizePageItems(payload);
  writeCache(cacheKey, flashSales, 30 * 1000);
  return flashSales;
};
