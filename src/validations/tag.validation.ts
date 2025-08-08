import * as z from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(2, "Etiket adı en az 2 karakter olmalıdır")
    .max(50, "Etiket adı en fazla 50 karakter olabilir")
    .regex(
      /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s\-_]+$/,
      "Etiket adı sadece harf, sayı, boşluk, tire ve alt çizgi içerebilir",
    )
    .trim(),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .min(2, "Etiket adı en az 2 karakter olmalıdır")
    .max(50, "Etiket adı en fazla 50 karakter olabilir")
    .regex(
      /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s\-_]+$/,
      "Etiket adı sadece harf, sayı, boşluk, tire ve alt çizgi içerebilir",
    )
    .trim(),
});

export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
