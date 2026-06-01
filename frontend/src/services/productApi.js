const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

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
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
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

export const fetchProductById = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error('Không lấy được chi tiết sản phẩm từ backend');
  }

  const payload = await response.json();
  return mapApiProduct(payload.data);
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
