import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  getPortfolioList,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolioById,
} from "@/services/portfolio-service";
import type { PortfolioRequest } from "@/types/portfolio.types";
import { toast } from "sonner";

export const usePortfolioList = (
  page: number,
  size: number,
  sort: string,
  search: string,
) => {
  return useAuthQuery({
    queryKey: ["portfolio-list", page, size, sort, search],
    queryFn: () => getPortfolioList(page, size, sort, search),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePortfolioById = (id: number) => {
  return useAuthQuery({
    queryKey: ["portfolio-by-id", id],
    queryFn: () => getPortfolioById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PortfolioRequest) => createPortfolio(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-list"] });
      toast.success("Portfolio başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Portfolio oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdatePortfolio = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PortfolioRequest) => updatePortfolio(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-list"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-by-id", id] });
      toast.success("Portfolio başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Portfolio güncellenirken bir hata oluştu");
    },
  });
};

export const useDeletePortfolioById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePortfolioById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-list"] });
      toast.success("Portfolio başarıyla silindi");
    },
  });
};
