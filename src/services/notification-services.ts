import { fetchClient } from "@/utils/fetch-client";
import type {
  NotificationRequest,
  NotificationList,
  Notification,
} from "@/types/notification.types";

export const getNotificationList = (
  page: number,
  size: number,
  sort: string,
) => {
  return fetchClient<void, NotificationList>(
    `/admin/notifications?page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const getNotificationById = (id: number) => {
  return fetchClient<void, Notification>(`/admin/notifications/${id}`, {
    method: "GET",
  });
};

export const createNotification = (notification: NotificationRequest) => {
  return fetchClient<NotificationRequest, Notification>(
    `/admin/notifications`,
    {
      method: "POST",
      body: notification,
    },
  );
};

export const sendNotification = (id: number) => {
  return fetchClient<void, void>(`/admin/notifications/${id}/send`, {
    method: "POST",
  });
};

export const updateNotification = (
  id: number,
  notification: NotificationRequest,
) => {
  return fetchClient<NotificationRequest, Notification>(
    `/admin/notifications/${id}`,
    {
      method: "PUT",
      body: notification,
    },
  );
};

export const deleteNotification = (id: number) => {
  return fetchClient<void, void>(`/admin/notifications/${id}`, {
    method: "DELETE",
  });
};
