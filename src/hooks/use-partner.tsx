import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerList,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from "@/services/partner-services";
import type { PartnerRequest } from "@/types/partner.types";
import { toast } from "sonner";

export const usePartnerList = () => {
  return useQuery({
    queryKey: ["partner-list"],
    queryFn: () => getPartnerList(),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePartnerById = (partnerId: number) => {
  return useQuery({
    queryKey: ["partner-by-id", partnerId],
    queryFn: () => getPartnerById(partnerId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PartnerRequest) => createPartner(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-list"] });
      toast.success("Partner başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Partner oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdatePartner = (partnerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PartnerRequest) => updatePartner(partnerId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-list"] });
      queryClient.invalidateQueries({ queryKey: ["partner-by-id", partnerId] });
      toast.success("Partner başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Partner güncellenirken bir hata oluştu");
    },
  });
};

export const useDeletePartnerById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: number) => deletePartner(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-list"] });
      toast.success("Partner başarıyla silindi");
    },
    onError: () => {
      toast.error("Partner silinirken bir hata oluştu");
    },
  });
};
