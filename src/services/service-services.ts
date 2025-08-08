import type {
  Service,
  ServiceRequest,
  ServiceList,
} from "@/types/service.types";
import { fetchClient } from "@/utils/fetch-client";

export const getServiceList = (
  search: string,
  page: number,
  size: number,
  sort: string,
) => {
  return fetchClient<void, ServiceList>(
    `/services?search=${search}&page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const getServiceById = (id: number) => {
  return fetchClient<void, Service>(`/services/${id}`, {
    method: "GET",
  });
};

export const createService = (request: ServiceRequest) => {
  return fetchClient<ServiceRequest, Service>("/admin/services", {
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateService = (id: number, request: ServiceRequest) => {
  return fetchClient<ServiceRequest, Service>(`/admin/services/${id}`, {
    method: "PUT",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteService = (id: number) => {
  return fetchClient<void, void>(`/admin/services/${id}`, {
    method: "DELETE",
  });
};
