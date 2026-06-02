const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const CACHE_PREFIX = 'ctc-api-cache:';
const pendingRequests = new Map();

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

export const clearProductCache = () => {
  clearCacheContaining('product:');
  clearCacheContaining('products:');
};

const cachedRequest = async (key, ttlMs, request) => {
  const cached = readCache(key);
  if (cached) return cached;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const pending = request()
    .then((value) => {
      writeCache(key, value, ttlMs);
      return value;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, pending);
  return pending;
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
    isActive: product.is_active !== false,
    isAvailable: product.is_active !== false && Number(product.stock || 0) > 0,
    description: product.description || '',
    storage: STORAGE_RULES[category] || 'Bảo quản nơi khô ráo, thoáng mát',
    image: resolveImageUrl(product.image_url),
    flashSale: Boolean(flashSalePrice || discountPrice),
    isFlashSale: Boolean(flashSalePrice),
    flashSalePrice,
    flashSaleSoldPercent: product.flash_sale_sold_percent ?? null,
    flashSaleRemaining: product.flash_sale_remaining ?? null,
    flashSaleEndTime: product.flash_sale_end_time ?? null,
    reviewSummary: {
      count: Number(product.review_summary?.count || 0),
      averageRating: Number(product.review_summary?.average_rating || 0),
    },
    reviews: Array.isArray(product.reviews)
      ? product.reviews.map((review) => ({
          id: String(review.id),
          rating: Number(review.rating || 0),
          comment: review.comment || '',
          userName: review.user_name || 'Khách hàng',
          createdAt: review.created_at || '',
        }))
      : [],
    sequence: Number(product.id),
  };
};

export const fetchProducts = async ({ storeId, search, perPage = 40 } = {}) => {
  const params = new URLSearchParams({ per_page: String(perPage), simple: '1' });

  if (storeId) params.set('store_id', String(storeId));
  if (search) params.set('search', search);

  const cacheKey = `products:${params.toString()}`;
  return cachedRequest(cacheKey, 5 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c s?n ph?m t? backend');
    }

    const payload = await response.json();
    return normalizePageItems(payload).map(mapApiProduct);
  });
};

export const fetchProductById = async (productId) => {
  return cachedRequest(`product:${productId}`, 5 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c chi ti?t s?n ph?m t? backend');
    }

    const payload = await response.json();
    return mapApiProduct(payload.data);
  });
};

export const fetchStores = async () => {
  return cachedRequest('stores', 10 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/stores`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c si?u th? t? backend');
    }

    const payload = await response.json();
    return normalizePageItems(payload);
  });
};

export const fetchCategories = async () => {
  return cachedRequest('categories', 10 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c danh m?c t? backend');
    }

    const payload = await response.json();
    return normalizePageItems(payload).map((category) => ({
      id: Number(category.id),
      name: CATEGORY_NAME_MAP[category.name] || category.name,
    }));
  });
};

export const fetchVouchers = async ({ storeId, userId } = {}) => {
  const params = new URLSearchParams();

  if (storeId) params.set('store_id', String(storeId));
  if (userId) params.set('user_id', String(userId));

  const cacheKey = `vouchers:${params.toString()}`;
  return cachedRequest(cacheKey, 2 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/vouchers?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c voucher t? backend');
    }

    const payload = await response.json();
    return normalizePageItems(payload);
  });
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
  return cachedRequest(cacheKey, 2 * 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/user-vouchers?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c v? voucher');
    }

    const payload = await response.json();
    return normalizePageItems(payload);
  });
};

export const fetchFlashSales = async ({ storeId, status = 'active' } = {}) => {
  const params = new URLSearchParams();

  if (storeId) params.set('store_id', String(storeId));
  if (status) params.set('status', status);

  const cacheKey = `flash-sales:${params.toString()}`;
  return cachedRequest(cacheKey, 60 * 1000, async () => {
    const response = await fetch(`${API_BASE_URL}/flash-sales?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Kh?ng l?y ???c flash sale');
    }

    const payload = await response.json();
    return normalizePageItems(payload);
  });
};
