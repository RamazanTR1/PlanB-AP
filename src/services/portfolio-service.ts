import { fetchClient } from "@/utils/fetch-client";
import type {
  PortfolioList,
  Portfolio,
  PortfolioRequest,
} from "@/types/portfolio.types";

export const getPortfolioList = async (
  page: number,
  size: number,
  sort: string,
  search: string,
) => {
  return fetchClient<void, PortfolioList>(
    `/portfolios?page=${page}&size=${size}&sort=${sort}&search=${search}`,
    {
      method: "GET",
    },
  );
};

export const getPortfolioById = async (id: number) => {
  return fetchClient<void, Portfolio>(`/portfolios/${id}`, {
    method: "GET",
  });
};

export const createPortfolio = async (request: PortfolioRequest) => {
  return fetchClient<PortfolioRequest, Portfolio>(`/admin/portfolios`, {
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePortfolio = async (
  id: number,
  request: PortfolioRequest,
) => {
  return fetchClient<PortfolioRequest, Portfolio>(`/admin/portfolios/${id}`, {
    method: "PUT",
    body: request,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePortfolioById = async (id: number) => {
  return fetchClient<void, void>(`/admin/portfolios/${id}`, {
    method: "DELETE",
  });
};
