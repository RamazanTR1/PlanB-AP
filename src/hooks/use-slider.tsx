import { useAuthQuery } from "./use-auth-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSliderList,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from "@/services/slider-services";
import type { SliderRequest, SliderList, Slider } from "@/types/slider.types";
import { toast } from "sonner";

export const useSliderList = (page: number, size: number, sort: string) => {
  return useAuthQuery<SliderList>({
    queryKey: ["slider-list", page, size, sort],
    queryFn: () => getSliderList(page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useSliderById = (id: number) => {
  return useAuthQuery<Slider>({
    queryKey: ["slider-by-id", id],
    queryFn: () => getSliderById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slider: SliderRequest) => createSlider(slider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider-list"] });
      toast.success("Slider başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Slider oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdateSlider = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slider: SliderRequest) => updateSlider(id, slider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider-list"] });
      queryClient.invalidateQueries({ queryKey: ["slider-by-id", id] });
      toast.success("Slider başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Slider güncellenirken bir hata oluştu");
    },
  });
};

export const useDeleteSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSlider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider-list"] });
      toast.success("Slider başarıyla silindi");
    },
    onError: () => {
      toast.error("Slider silinirken bir hata oluştu");
    },
  });
};
