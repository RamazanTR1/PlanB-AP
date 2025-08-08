import { fetchClient } from "@/utils/fetch-client";
import type {
  NotificationSubscriberRequest,
  NotificationSubscriberList,
  NotificationSubscriber,
} from "@/types/notification-subscriber.types";

export const getNotificationSubscriberList = async (
  page: number,
  size: number,
  sort: string,
) => {
  return fetchClient<void, NotificationSubscriberList>(
    `/admin/notification-subscribers?page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const createNotificationSubscriber = async (
  subscriberInfo: NotificationSubscriberRequest,
) => {
  return fetchClient<NotificationSubscriberRequest, NotificationSubscriber>(
    `/notification-subscribers`,
    {
      method: "POST",
      body: subscriberInfo,
    },
  );
};

export const deleteNotificationSubscriber = async (subscriberId: number) => {
  return fetchClient<void, void>(
    `/admin/notification-subscribers/${subscriberId}`,
    {
      method: "DELETE",
    },
  );
};
