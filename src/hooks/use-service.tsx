import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  getServiceList,
  createService,
  deleteService,
  getServiceById,
  updateService,
} from "../services/service-services";
import { toast } from "sonner";
import type { ServiceRequest } from "@/types/service.types";

export const useServiceList = (
  search: string,
  page: number,
  size: number,
  sort: string,
) => {
  return useAuthQuery({
    queryKey: ["service-list", search, page, size, sort],
    queryFn: () => getServiceList(search, page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useServiceById = (id: number) => {
  return useAuthQuery({
    queryKey: ["service-by-id", id],
    queryFn: () => getServiceById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: ServiceRequest) => createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-list"] });
      toast.success("Hizmet başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Hizmet oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdateService = (serviceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: ServiceRequest) =>
      updateService(serviceId, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-list"] });
      queryClient.invalidateQueries({ queryKey: ["service-by-id", serviceId] });
      toast.success("Hizmet başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Hizmet güncellenirken bir hata oluştu");
    },
  });
};

export const useDeleteServiceById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-list"] });
      toast.success("Hizmet başarıyla silindi");
    },
    onError: () => {
      toast.error("Hizmet silinirken bir hata oluştu");
    },
  });
};
