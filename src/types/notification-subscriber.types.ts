import type { Page } from "./user.types";

export interface NotificationSubscriberRequest {
  email: string;
  phoneNumber: string;
}

export interface NotificationSubscriber {
  id: number;
  email: string;
  phoneNumber: string;
}

export interface NotificationSubscriberList {
  content: NotificationSubscriber[];
  page: Page;
}
