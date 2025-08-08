import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  getContactList,
  createContact,
  deleteContact,
} from "@/services/contact-services";
import { toast } from "sonner";
import type { ContactRequest } from "@/types/contact.types";

export const useContactList = (page: number, size: number, sort: string) => {
  return useAuthQuery({
    queryKey: ["contact-list", page, size, sort],
    queryFn: () => getContactList(page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactInfo: ContactRequest) => createContact(contactInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-list"] });
      toast.success("İletişim formu başarıyla gönderildi");
    },
    onError: () => {
      toast.error("İletişim formu gönderilirken bir hata oluştu");
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: number) => deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-list"] });
      toast.success("İletişim formu başarıyla silindi");
    },
    onError: () => {
      toast.error("İletişim formu silinirken bir hata oluştu");
    },
  });
};
