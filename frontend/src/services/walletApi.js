const API_BASE_URL = 'http://localhost:8000/api';

const getAuthToken = () => window.localStorage.getItem('auth_token');

const authHeaders = () => {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeWallet = (wallet = {}) => ({
  id: wallet.id,
  userId: Number(wallet.user_id || wallet.userId || 0),
  balance: Number(wallet.balance || 0),
  transactions: Array.isArray(wallet.transactions)
    ? wallet.transactions.map((transaction) => ({
        id: transaction.id,
        orderId: transaction.order_id,
        type: transaction.type,
        amount: Number(transaction.amount || 0),
        balanceAfter: Number(transaction.balance_after || 0),
        description: transaction.description || '',
        createdAt: transaction.created_at,
      }))
    : [],
});

export async function fetchWallet() {
  const response = await fetch(`${API_BASE_URL}/wallet`, {
    headers: { Accept: 'application/json', ...authHeaders() },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể lấy ví.');
  }

  return normalizeWallet(payload.data);
}

export async function topUpWallet({ amount }) {
  const response = await fetch(`${API_BASE_URL}/wallet/top-up`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ amount }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể nạp ví.');
  }

  return normalizeWallet(payload.data);
}
