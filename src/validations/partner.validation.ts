import { z } from "zod";

export const createPartnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  icon: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Lütfen bir ikon dosyası yükleyin",
    })
    .refine(
      (files) =>
        files instanceof FileList &&
        files.length > 0 &&
        ["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(
          files[0]?.type,
        ),
      {
        message: "İkon PNG, JPG, SVG veya WEBP olmalıdır",
      },
    ),
});

export const updatePartnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  // icon optional — only when user selects
  icon: z
    .any()
    .optional()
    .refine(
      (files) =>
        files === undefined ||
        (files instanceof FileList &&
          files.length > 0 &&
          ["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(
            files[0]?.type,
          )),
      {
        message: "İkon PNG, JPG, SVG veya WEBP olmalıdır",
      },
    ),
});

export type CreatePartnerFormData = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerFormData = z.infer<typeof updatePartnerSchema>;
