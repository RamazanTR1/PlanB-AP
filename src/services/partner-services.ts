import { fetchClient } from "@/utils/fetch-client";
import type { Partner, PartnerRequest } from "@/types/partner.types";

export const getPartnerList = async () => {
  return fetchClient<void, Partner[]>(`/partners`, {
    method: "GET",
  });
};

export const getPartnerById = async (partnerId: number) => {
  return fetchClient<void, Partner>(`/partners/${partnerId}`, {
    method: "GET",
  });
};

export const createPartner = async (request: PartnerRequest) => {
  return fetchClient<PartnerRequest, Partner>(`/admin/partners`, {
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePartner = async (
  partnerId: number,
  request: PartnerRequest,
) => {
  return fetchClient<PartnerRequest, Partner>(`/admin/partners/${partnerId}`, {
    method: "PUT",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePartner = async (partnerId: number) => {
  return fetchClient<void, void>(`/admin/partners/${partnerId}`, {
    method: "DELETE",
  });
};
