import { getAuthToken } from './authApi';
import { mapApiProduct } from './productApi';

const API_BASE_URL = 'http://localhost:8000/api';

const authHeaders = () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Vui lòng đăng nhập để sử dụng sản phẩm yêu thích.');
  }

  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const readPayload = async (response) => response.json().catch(() => ({}));

const mapFavorite = (favorite) => ({
  id: String(favorite.product_id || favorite.product?.id),
  favoriteId: favorite.id,
  addedAt: favorite.added_at,
  ...mapApiProduct(favorite.product),
});

export const fetchFavoriteProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: authHeaders(),
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Không lấy được danh sách sản phẩm yêu thích.');
  }

  return Array.isArray(payload.data) ? payload.data.map(mapFavorite) : [];
};

export const addFavoriteProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId }),
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    const validationMessage = payload.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : null;

    throw new Error(validationMessage || payload.message || 'Không thêm được sản phẩm yêu thích.');
  }

  return mapFavorite(payload.data);
};

export const removeFavoriteProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Không xóa được sản phẩm yêu thích.');
  }

  return payload;
};
