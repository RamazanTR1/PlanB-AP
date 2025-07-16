import { useMutation } from "@tanstack/react-query";
import { Login, Logout, AdminUserRegister } from "@/services/auth-services";
import type { AdminUserRequest, LoginRequest } from "@/types/auth-types";
import { toast } from "sonner";

export const useLogin = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (request: LoginRequest) => Login(request),
		onSuccess: () => {
			toast.success("Giriş başarılı");
		},
		onError: () => {
			toast.error("Giriş başarısız");
		},
	});
	return { mutateAsync, isPending };
};

export const useLogout = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: () => Logout(),
		onSuccess: () => {
			toast.success("Çıkış başarılı");
		},
		onError: () => {
			toast.error("Çıkış başarısız");
		},
	});
	return { mutateAsync, isPending };
};

export const useAdminUserRegister = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (request: AdminUserRequest) => AdminUserRegister(request),
		onSuccess: () => {
			toast.success("Admin, kullanıcıyı başarılı bir şekilde oluşturuldu");
		},
		onError: () => {
			toast.error("Admin, kullanıcıyı oluştururken bir hata oluştu");
		},
	});
	return { mutateAsync, isPending };
};
