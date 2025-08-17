import type { Page } from "./user.types";

export interface NotificationRequest {
  title: string;
  content: string;
  type: "EMAIL" | "SMS";
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: "EMAIL" | "SMS";
}

export interface NotificationList {
  content: Notification[];
  page: Page;
}
