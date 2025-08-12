import { fetchClient } from "@/utils/fetch-client";
import type { SliderRequest, SliderList, Slider } from "@/types/slider.types";

export const getSliderList = (page: number, size: number, sort: string) => {
  return fetchClient<void, SliderList>(
    `/sliders?page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const getSliderById = (id: number) => {
  return fetchClient<void, Slider>(`/sliders/${id}`, {
    method: "GET",
  });
};

export const createSlider = (slider: SliderRequest) => {
  return fetchClient<SliderRequest, Slider>(`/admin/sliders`, {
    method: "POST",
    body: slider,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateSlider = (id: number, slider: SliderRequest) => {
  return fetchClient<SliderRequest, Slider>(`/admin/sliders/${id}`, {
    method: "PUT",
    body: slider,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteSlider = (id: number) => {
  return fetchClient<void, void>(`/admin/sliders/${id}`, {
    method: "DELETE",
  });
};
