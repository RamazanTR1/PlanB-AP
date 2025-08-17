import { z } from "zod";

export const portfolioBaseSchema = {
  name: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalı")
    .max(150, "Başlık en fazla 150 karakter olabilir"),
  description: z
    .string()
    .trim()
    .min(10, "Açıklama en az 10 karakter olmalı")
    .max(5000, "Açıklama çok uzun"),
  excerpt: z
    .string()
    .trim()
    .max(300, "Özet en fazla 300 karakter olabilir")
    .optional()
    .default(""),
  outSourceLink: z
    .string()
    .trim()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  publishDate: z.string().trim().min(1, "Yayın tarihi zorunludur"),
};

export const createPortfolioSchema = z.object({
  name: portfolioBaseSchema.name,
  description: portfolioBaseSchema.description,
  excerpt: portfolioBaseSchema.excerpt,
  outSourceLink: portfolioBaseSchema.outSourceLink.optional().or(z.literal("")),
  publishDate: portfolioBaseSchema.publishDate,
  assets: z.any().optional(), // FileList için any kullanıyoruz
});

export const updatePortfolioSchema = z.object({
  name: portfolioBaseSchema.name,
  description: portfolioBaseSchema.description,
  excerpt: portfolioBaseSchema.excerpt,
  outSourceLink: portfolioBaseSchema.outSourceLink.optional().or(z.literal("")),
  publishDate: portfolioBaseSchema.publishDate,
  assets: z.any().optional(), // FileList için any kullanıyoruz
});

export type CreatePortfolioFormData = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioFormData = z.infer<typeof updatePortfolioSchema>;
