const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const PUBLIC_CACHE_PREFIXES = ['ctc-api-cache:products:', 'ctc-api-cache:flash-sales:'];

const getPartnerToken = () =>
  window.localStorage.getItem('partner_token') || window.sessionStorage.getItem('partner_token');

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

const formatUpdatedAt = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

const clearPublicProductCache = () => {
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => PUBLIC_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Cache cleanup should not block inventory updates.
  }
};

export const mapPartnerProduct = (product) => ({
  id: String(product.id),
  name: product.name,
  price: Number(product.original_price || product.price || 0),
  stock: Number(product.stock || 0),
  unit: product.unit || 'sản phẩm',
  category: product.category?.name || 'Khác',
  active: Boolean(product.is_active),
  updatedAt: formatUpdatedAt(product.updated_at),
  img: resolveImageUrl(product.image_url),
});

export const fetchPartnerProducts = async ({ search, perPage = 100 } = {}) => {
  const token = getPartnerToken();

  if (!token) {
    throw new Error('Bạn cần đăng nhập tài khoản đối tác để quản lý kho.');
  }

  const params = new URLSearchParams({ per_page: String(perPage) });
  if (search) params.set('search', search);

  const response = await fetch(`${API_BASE_URL}/partner/products?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không lấy được sản phẩm trong kho.');
  }

  return {
    store: payload.store || null,
    products: (payload.data?.data || []).map(mapPartnerProduct),
  };
};

export const updatePartnerProductStock = async (productId, stock) => {
  return updatePartnerProduct(productId, { stock });
};

export const updatePartnerProductStatus = async (productId, isActive) => {
  return updatePartnerProduct(productId, { is_active: isActive });
};

export const updatePartnerProductInfo = async (productId, { name, originalPrice }) => {
  return updatePartnerProduct(productId, {
    name,
    original_price: originalPrice,
  });
};

const updatePartnerProduct = async (productId, changes) => {
  const token = getPartnerToken();

  if (!token) {
    throw new Error('Bạn cần đăng nhập tài khoản đối tác để cập nhật sản phẩm.');
  }

  const response = await fetch(`${API_BASE_URL}/partner/products/${productId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changes),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không cập nhật được sản phẩm.');
  }

  clearPublicProductCache();
  return mapPartnerProduct(payload.data);
};
