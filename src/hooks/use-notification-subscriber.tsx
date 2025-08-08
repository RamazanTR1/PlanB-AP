import { useAuthQuery } from "./use-auth-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSubscriberList,
  createNotificationSubscriber,
  deleteNotificationSubscriber,
} from "@/services/notification-subscriber-services";
import { toast } from "sonner";
import type { NotificationSubscriberRequest } from "@/types/notification-subscriber.types";

export const useNotificationSubscriberList = (
  page: number,
  size: number,
  sort: string,
) => {
  return useAuthQuery({
    queryKey: ["notification-subscriber-list", page, size, sort],
    queryFn: () => getNotificationSubscriberList(page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateNotificationSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriberInfo: NotificationSubscriberRequest) =>
      createNotificationSubscriber(subscriberInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notification-subscriber-list"],
      });
      toast.success("Aboneliğiniz başarıyla kaydedildi");
    },
    onError: () => {
      toast.error(
        "Aboneliğiniz kaydedilirken bir hata oluştu, tekrar deneyiniz",
      );
    },
  });
};

export const useDeleteNotificationSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriberId: number) =>
      deleteNotificationSubscriber(subscriberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notification-subscriber-list"],
      });
      toast.success("Aboneliğiniz başarıyla silindi");
    },
    onError: () => {
      toast.error("Aboneliğiniz silinirken bir hata oluştu, tekrar deneyiniz");
    },
  });
};
