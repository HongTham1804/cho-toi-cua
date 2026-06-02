const STORAGE_KEY = 'ctc-flash-sale-reminders';
const LOCAL_NOTIFICATION_PREFIX = 'flash-reminder:';

const readReminders = () => {
  try {
    const reminders = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(reminders) ? reminders : [];
  } catch {
    return [];
  }
};

const writeReminders = (reminders) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch {
    // Local reminders are a convenience. If storage is blocked, the page still works.
  }
};

const formatPrice = (price) => `${Number(price || 0).toLocaleString('vi-VN')}đ`;

const normalizeReminderId = (id) => String(id || '').replace(LOCAL_NOTIFICATION_PREFIX, '');

export const saveFlashSaleReminder = ({ product, flashSale, storeId }) => {
  if (!product || !flashSale?.start_time) {
    return null;
  }

  const reminderId = `${flashSale.id}:${product.flashSaleProductId || product.id}`;
  const reminders = readReminders();
  const nextReminder = {
    id: reminderId,
    type: 'promotion',
    productId: product.id,
    productName: product.name,
    salePrice: product.price,
    originalPrice: product.originalPrice,
    storeId: Number(storeId || product.store_id || 0),
    flashSaleId: flashSale.id,
    startsAt: flashSale.start_time,
    endsAt: flashSale.end_time,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  const nextReminders = [
    nextReminder,
    ...reminders.filter((reminder) => reminder.id !== reminderId),
  ];

  writeReminders(nextReminders);
  return nextReminder;
};

export const getFlashSaleReminderIds = () => readReminders().map((reminder) => reminder.id);

export const getDueFlashSaleNotifications = (nowMs = Date.now()) =>
  readReminders()
    .filter((reminder) => {
      const startMs = new Date(reminder.startsAt).getTime();
      const endMs = new Date(reminder.endsAt).getTime();

      return Number.isFinite(startMs) && Number.isFinite(endMs) && nowMs >= startMs && nowMs <= endMs;
    })
    .map((reminder) => ({
      id: `${LOCAL_NOTIFICATION_PREFIX}${reminder.id}`,
      type: 'promotion',
      title: 'Flash sale đã bắt đầu',
      message: `${reminder.productName} đang được sale với giá ${formatPrice(reminder.salePrice)}.`,
      time: new Date(reminder.startsAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      createdAt: reminder.startsAt,
      isRead: Boolean(reminder.isRead),
      link: `/product-detail/${reminder.productId}${reminder.storeId ? `?store_id=${reminder.storeId}` : ''}`,
      isLocalReminder: true,
    }));

export const markFlashSaleReminderRead = (notificationId) => {
  const reminderId = normalizeReminderId(notificationId);
  const reminders = readReminders();

  writeReminders(
    reminders.map((reminder) =>
      reminder.id === reminderId ? { ...reminder, isRead: true } : reminder
    )
  );
};

export const markAllDueFlashSaleRemindersRead = (nowMs = Date.now()) => {
  const reminders = readReminders();

  writeReminders(
    reminders.map((reminder) => {
      const startMs = new Date(reminder.startsAt).getTime();
      const endMs = new Date(reminder.endsAt).getTime();
      const isDue = Number.isFinite(startMs) && Number.isFinite(endMs) && nowMs >= startMs && nowMs <= endMs;

      return isDue ? { ...reminder, isRead: true } : reminder;
    })
  );
};

export const isFlashSaleReminderNotification = (id) =>
  String(id || '').startsWith(LOCAL_NOTIFICATION_PREFIX);
