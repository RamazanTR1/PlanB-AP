import type { Setting, SettingRequest } from "@/types/setting.types";
import { fetchClient } from "@/utils/fetch-client";

export const updateSettings = (settings: SettingRequest) => {
  return fetchClient<SettingRequest, Setting>(`/admin/settings/1`, {
    method: "PUT",
    body: settings,
  });
};
