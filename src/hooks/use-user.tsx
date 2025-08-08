import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  deleteUserById,
  getMe,
  getUserById,
  getUserList,
  updateUser,
  createUser,
} from "../services/user-services";
import { toast } from "sonner";
import type { UpdateUserRequest, CreateUserRequest } from "@/types/user.types";

export const useMe = () => {
  return useAuthQuery({
    queryKey: ["me"],
    queryFn: getMe,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUserList = (
  search: string,
  page: number,
  size: number,
  sort: string,
) => {
  return useAuthQuery({
    queryKey: ["user-list", search, page, size, sort],
    queryFn: () => getUserList(search, page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserById = (id: number) => {
  return useAuthQuery({
    queryKey: ["user-by-id", id],
    queryFn: () => getUserById(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      toast.success("Kullanıcı başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Kullanıcı oluşturulurken bir hata oluştu, tekrar deneyiniz");
    },
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-by-id", userId] });
      toast.success("Kullanıcı başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Kullanıcı güncellenirken bir hata oluştu, tekrar deneyiniz");
    },
  });
};

export const useDeleteUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      toast.success("Kullanıcı başarıyla silindi");
    },
    onError: () => {
      toast.error("Kullanıcı silinirken bir hata oluştu, tekrar deneyiniz");
    },
  });
};
