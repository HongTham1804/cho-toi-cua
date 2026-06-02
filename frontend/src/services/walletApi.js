const API_BASE_URL = 'http://localhost:8000/api';

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

export async function fetchWallet({ userId }) {
  const response = await fetch(`${API_BASE_URL}/wallet?user_id=${encodeURIComponent(userId)}`, {
    headers: { Accept: 'application/json' },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể lấy ví.');
  }

  return normalizeWallet(payload.data);
}

export async function topUpWallet({ userId, amount }) {
  const response = await fetch(`${API_BASE_URL}/wallet/top-up`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, amount }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể nạp ví.');
  }

  return normalizeWallet(payload.data);
}
