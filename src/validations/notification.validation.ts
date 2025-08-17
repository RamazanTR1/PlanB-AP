import { z } from "zod";

export const notificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalı")
    .max(150, "Başlık en fazla 150 karakter olabilir"),
  content: z
    .string()
    .trim()
    .min(10, "İçerik en az 10 karakter olmalı")
    .max(1000, "İçerik en fazla 1000 karakter olabilir"),
  type: z.enum(["EMAIL", "SMS"]),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
