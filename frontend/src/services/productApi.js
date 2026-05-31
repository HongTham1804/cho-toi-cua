const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const CATEGORY_NAME_MAP = {
  'Sữa các loại': 'Sữa, đồ uống giải khát',
  'Rau - Củ - Trái Cây': 'Rau củ quả',
  'Hóa Phẩm - Tẩy rửa': 'Hóa phẩm, tẩy rửa',
  'Chăm Sóc Cá Nhân': 'Chăm sóc cá nhân',
  'Thịt - Hải Sản Tươi': 'Thịt, Cá, Hải sản',
  'Bánh Kẹo': 'Bánh kẹo, đồ ăn vặt',
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

export const mapApiProduct = (product) => {
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const price = discountPrice || Number(product.price);
  const originalPrice = discountPrice ? Number(product.original_price || product.price) : null;

  return {
    id: String(product.id),
    store_id: Number(product.store_id),
    storeName: product.store?.name || '',
    storeLogo: product.store?.logo_url || '',
    name: product.name,
    category: CATEGORY_NAME_MAP[product.category?.name] || product.category?.name || 'Tất cả sản phẩm',
    category_id: Number(product.category_id),
    price,
    originalPrice,
    image: resolveImageUrl(product.image_url),
    flashSale: Boolean(discountPrice),
    sequence: Number(product.id),
  };
};

export const fetchProducts = async ({ storeId, search, perPage = 100 } = {}) => {
  const params = new URLSearchParams({ per_page: String(perPage) });

  if (storeId) params.set('store_id', String(storeId));
  if (search) params.set('search', search);

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không lấy được sản phẩm từ backend');
  }

  const payload = await response.json();
  return normalizePageItems(payload).map(mapApiProduct);
};

export const fetchStores = async () => {
  const response = await fetch(`${API_BASE_URL}/stores`);

  if (!response.ok) {
    throw new Error('Không lấy được siêu thị từ backend');
  }

  const payload = await response.json();
  return normalizePageItems(payload);
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('Không lấy được danh mục từ backend');
  }

  const payload = await response.json();
  return normalizePageItems(payload).map((category) => ({
    id: Number(category.id),
    name: CATEGORY_NAME_MAP[category.name] || category.name,
  }));
};
