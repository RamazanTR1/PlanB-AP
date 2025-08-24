import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteLogo: z.string().trim().url("Geçerli bir URL girin").optional().or(z.literal("")),
  maintenanceMode: z.boolean().default(false).optional(),
  aboutUsDescription: z
    .string()
    .trim()
    .refine((val) => val === "" || val.length >= 10, {
      message: "Hakkımızda açıklaması en az 10 karakter olmalı"
    })
    .refine((val) => val === "" || val.length <= 5000, {
      message: "Açıklama çok uzun"
    })
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Geçerli bir e‑posta adresi girin").optional().or(z.literal("")),
  instagramUrl: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Geçerli bir URL girin"
    })
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Geçerli bir URL girin"
    })
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Geçerli bir URL girin"
    })
    .optional()
    .or(z.literal("")),
  xurl: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Geçerli bir URL girin"
    })
    .optional()
    .or(z.literal("")),
  teamMembersHeader: z
    .string()
    .trim()
    .refine((val) => val === "" || val.length >= 3, {
      message: "Ekip başlığı en az 3 karakter olmalı"
    })
    .refine((val) => val === "" || val.length <= 150, {
      message: "Ekip başlığı en fazla 150 karakter olabilir"
    })
    .optional()
    .or(z.literal("")),
  teamMembersDescription: z
    .string()
    .trim()
    .refine((val) => val === "" || val.length >= 10, {
      message: "Ekip açıklaması en az 10 karakter olmalı"
    })
    .refine((val) => val === "" || val.length <= 2000, {
      message: "Ekip açıklaması çok uzun"
    })
    .optional()
    .or(z.literal("")),
});

export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
