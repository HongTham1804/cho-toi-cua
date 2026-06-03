import { getAuthToken } from "../../../services/authApi";
import {
  getDueFlashSaleNotifications,
  isFlashSaleReminderNotification,
  markAllDueFlashSaleRemindersRead,
  markFlashSaleReminderRead,
} from "../../../services/flashSaleReminderStorage";

const API_BASE_URL = "http://localhost:8000/api";

function authHeaders() {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatNotificationTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function mapNotification(item) {
  return {
    id: item.id,
    type: item.type || "info",
    title: item.title || "Thong bao",
    message: item.message || "",
    time: formatNotificationTime(item.created_at),
    createdAt: item.created_at || "",
    isRead: Boolean(item.is_read),
    link: item.link || "/notifications",
  };
}

export async function fetchNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Khong the tai thong bao.");
  }

  const backendNotifications = (payload.data || []).map(mapNotification);
  const flashSaleNotifications = getDueFlashSaleNotifications();

  return [...flashSaleNotifications, ...backendNotifications]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
}

export async function markOneRead(id) {
  if (isFlashSaleReminderNotification(id)) {
    markFlashSaleReminderRead(id);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: "{}",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Khong the cap nhat thong bao.");
  }
}

export async function markAllRead() {
  markAllDueFlashSaleRemindersRead();

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: "{}",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Khong the cap nhat thong bao.");
  }
}
