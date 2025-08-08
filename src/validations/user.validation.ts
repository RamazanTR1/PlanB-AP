import * as z from "zod";

export const createUserSchema = z.object({
	username: z
		.string()
		.min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
		.max(50, "Kullanıcı adı en fazla 50 karakter olabilir")
		.regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, sayı ve alt çizgi içerebilir"),
	email: z
		.string()
		.email("Geçerli bir e-posta adresi giriniz")
		.min(1, "E-posta adresi gereklidir"),
	password: z
		.string()
		.min(8, "Şifre en az 8 karakter olmalıdır")
		.max(50, "Şifre en fazla 50 karakter olabilir"),
	confirmPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Şifreler eşleşmiyor",
	path: ["confirmPassword"],
});

export const updateUserSchema = z.object({
	username: z
		.string()
		.min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
		.max(50, "Kullanıcı adı en fazla 50 karakter olabilir")
		.regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, sayı ve alt çizgi içerebilir"),
	email: z
		.string()
		.email("Geçerli bir e-posta adresi giriniz")
		.min(1, "E-posta adresi gereklidir"),
	password: z
		.string()
		.min(8, "Şifre en az 8 karakter olmalıdır")
		.max(50, "Şifre en fazla 50 karakter olabilir"),
	active: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;