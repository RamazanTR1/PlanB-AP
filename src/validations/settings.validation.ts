import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteLogo: z.string().trim().url("Geçerli bir URL girin"),
  maintenanceMode: z.boolean().default(false),
  aboutUsDescription: z
    .string()
    .trim()
    .min(10, "Hakkımızda açıklaması en az 10 karakter olmalı")
    .max(5000, "Açıklama çok uzun"),
  email: z.string().trim().email("Geçerli bir e‑posta adresi girin"),
  instagramUrl: z
    .string()
    .trim()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .trim()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .trim()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  xurl: z
    .string()
    .trim()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  teamMembersHeader: z
    .string()
    .trim()
    .min(3, "Ekip başlığı en az 3 karakter olmalı")
    .max(150, "Ekip başlığı en fazla 150 karakter olabilir"),
  teamMembersDescription: z
    .string()
    .trim()
    .min(10, "Ekip açıklaması en az 10 karakter olmalı")
    .max(2000, "Ekip açıklaması çok uzun"),
});

export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
