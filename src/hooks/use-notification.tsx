import { useAuthQuery } from "./use-auth-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotificationList,
  sendNotification,
  updateNotification,
} from "@/services/notification-services";
import type { NotificationRequest } from "@/types/notification.types";
import { toast } from "sonner";

export const useNotificationList = (
  page: number,
  size: number,
  sort: string,
) => {
  return useAuthQuery({
    queryKey: ["notification-list", page, size, sort],
    queryFn: () => getNotificationList(page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useNotificationById = (id: number) => {
  return useAuthQuery({
    queryKey: ["notification-by-id", id],
    queryFn: () => getNotificationById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useNotificationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: NotificationRequest) =>
      createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-list"] });
      toast.success("Bildirim başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Bildirim oluşturulurken bir hata oluştu");
    },
  });
};

export const useNotificationSend = () => {
  return useMutation({
    mutationFn: (id: number) => sendNotification(id),
    onSuccess: () => {
      toast.success("Bildirim başarıyla gönderildi");
    },
    onError: () => {
      toast.error("Bildirim gönderilirken bir hata oluştu");
    },
  });
};

export const useNotificationUpdate = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: NotificationRequest) =>
      updateNotification(id, notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-list"] });
      queryClient.invalidateQueries({ queryKey: ["notification-by-id", id] });
      toast.success("Bildirim başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Bildirim güncellenirken bir hata oluştu");
    },
  });
};

export const useNotificationDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-list"] });
      toast.success("Bildirim başarıyla silindi");
    },
    onError: () => {
      toast.error("Bildirim silinirken bir hata oluştu");
    },
  });
};
