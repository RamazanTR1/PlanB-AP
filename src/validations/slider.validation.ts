import { z } from "zod";

export const sliderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalı")
    .max(150, "Başlık en fazla 150 karakter olabilir"),
  description: z
    .string()
    .trim()
    .min(10, "Açıklama en az 10 karakter olmalı")
    .max(1000, "Açıklama en fazla 1000 karakter olabilir"),
  excerpt: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .pipe(z.string().max(300, "Özet en fazla 300 karakter olabilir")),
  tagIds: z.array(z.number()).min(0).default([]),
  image: z.instanceof(File).optional().or(z.null()).default(null),
});

export type SliderFormData = z.infer<typeof sliderSchema>;
