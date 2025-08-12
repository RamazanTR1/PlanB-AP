import { useMutation } from "@tanstack/react-query";
import { updateSettings } from "@/services/setting-services";
import type { SettingRequest } from "@/types/setting.types";
import { toast } from "sonner";

export const useUpdateSettings = () => {
  return useMutation({
    mutationKey: ["settings"],
    mutationFn: (settings: SettingRequest) => updateSettings(settings),
    onSuccess: () => {
      toast.success("Ayarlar başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Ayarlar güncellenirken bir hata oluştu");
    },
  });
};
