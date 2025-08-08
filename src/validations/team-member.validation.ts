import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(50, "İsim en fazla 50 karakter olabilir")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "İsim sadece harf içerebilir"),

  title: z
    .string()
    .min(2, "Pozisyon en az 2 karakter olmalıdır")
    .max(100, "Pozisyon en fazla 100 karakter olabilir"),

  quote: z
    .string()
    .min(10, "Kişisel görüş en az 10 karakter olmalıdır")
    .max(500, "Kişisel görüş en fazla 500 karakter olabilir"),

  linkedinUrl: z
    .string()
    .url("Geçerli bir LinkedIn URL'si giriniz")
    .refine((url) => url.includes("linkedin.com"), {
      message: "Geçerli bir LinkedIn URL'si giriniz",
    })
    .optional()
    .or(z.literal("")),

  orderNumber: z
    .number()
    .int("Sıra numarası tam sayı olmalıdır")
    .min(1, "Sıra numarası en az 1 olmalıdır")
    .max(999, "Sıra numarası en fazla 999 olabilir"),

  profilePhoto: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Profil fotoğrafı 5MB'dan küçük olmalıdır",
    })
    .refine(
      (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        return validTypes.includes(file.type);
      },
      {
        message:
          "Sadece JPEG, PNG veya WebP formatında dosya yükleyebilirsiniz",
      },
    )
    .optional()
    .nullable(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
