import React, { useEffect, useState } from 'react';
import './wallet.css';
import { fetchWallet, topUpWallet } from '../../services/walletApi';

const QUICK_AMOUNTS = [50000, 100000, 200000];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const transactionLabels = {
  topup: 'Nạp ví',
  payment: 'Thanh toán đơn hàng',
  refund: 'Hoàn tiền',
};

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(100000);
  const [isLoading, setIsLoading] = useState(true);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWallet = async () => {
    setIsLoading(true);
    setError('');

    try {
      setWallet(await fetchWallet());
    } catch (err) {
      setError(err.message || 'Không thể lấy ví.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleTopUp = async (amount = topUpAmount) => {
    if (isTopUpLoading || Number(amount) < 1000) return;

    setIsTopUpLoading(true);
    setError('');

    try {
      setWallet(await topUpWallet({ amount: Number(amount) }));
      setTopUpAmount(Number(amount));
    } catch (err) {
      setError(err.message || 'Không thể nạp ví.');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <main className="wallet-page">
      <section className="wallet-shell">
        <div className="wallet-heading">
          <div>
            <p>Ví nội bộ</p>
            <h1>Ví Chợ Tới Cửa</h1>
          </div>
          <i className="fa-solid fa-wallet" />
        </div>

        <div className="wallet-balance-panel">
          <span>Số dư khả dụng</span>
          <strong>{isLoading ? 'Đang tải...' : formatCurrency(wallet?.balance)}</strong>
          <p>Ví này dùng cho thanh toán trong app và hoàn tiền giả lập khi hủy đơn đã thanh toán.</p>
        </div>

        <div className="wallet-topup-panel">
          <h2>Nạp tiền giả lập</h2>
          <div className="wallet-quick-actions">
            {QUICK_AMOUNTS.map((amount) => (
              <button key={amount} type="button" onClick={() => handleTopUp(amount)} disabled={isTopUpLoading}>
                +{formatCurrency(amount)}
              </button>
            ))}
          </div>
          <div className="wallet-custom-topup">
            <input
              type="number"
              min="1000"
              step="1000"
              value={topUpAmount}
              onChange={(event) => setTopUpAmount(event.target.value)}
            />
            <button type="button" onClick={() => handleTopUp()} disabled={isTopUpLoading}>
              {isTopUpLoading ? 'Đang nạp...' : 'Nạp ví'}
            </button>
          </div>
          {error && <p className="wallet-error">{error}</p>}
        </div>

        <div className="wallet-history-panel">
          <h2>Lịch sử giao dịch</h2>
          {isLoading && <p className="wallet-empty">Đang tải giao dịch...</p>}
          {!isLoading && wallet?.transactions?.length === 0 && (
            <p className="wallet-empty">Chưa có giao dịch nào.</p>
          )}
          {!isLoading && wallet?.transactions?.map((transaction) => (
            <div key={transaction.id} className="wallet-transaction-row">
              <div>
                <strong>{transactionLabels[transaction.type] || transaction.type}</strong>
                <p>{transaction.description || 'Giao dịch ví'}</p>
              </div>
              <div className={transaction.amount >= 0 ? 'wallet-amount positive' : 'wallet-amount negative'}>
                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                <span>Còn {formatCurrency(transaction.balanceAfter)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
