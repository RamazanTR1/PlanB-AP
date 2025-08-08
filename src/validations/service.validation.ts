import * as z from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Hizmet adı en az 2 karakter olmalıdır")
    .max(100, "Hizmet adı en fazla 100 karakter olabilir")
    .trim(),
  description: z
    .string()
    .min(10, "Açıklama en az 10 karakter olmalıdır")
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .trim(),
  icon: z.instanceof(File).optional().or(z.string().optional()),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Hizmet adı en az 2 karakter olmalıdır")
    .max(100, "Hizmet adı en fazla 100 karakter olabilir")
    .trim(),
  description: z
    .string()
    .min(10, "Açıklama en az 10 karakter olmalıdır")
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .trim(),
  icon: z.instanceof(File).optional().or(z.string().optional()),
});

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
