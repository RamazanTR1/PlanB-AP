import { fetchClient } from "../utils/fetch-client";
import type { TagList, TagRequest, Tag } from "../types/tag.types";

export const getTagList = (
  search: string,
  page: number,
  size: number,
  sort: string,
) => {
  return fetchClient<void, TagList>(
    `/tags?search=${search}&page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const getTagById = (id: number) => {
  return fetchClient<void, Tag>(`/tags/${id}`, {
    method: "GET",
  });
};

export const createTag = (tag: TagRequest) => {
  return fetchClient<TagRequest, Tag>(`/admin/tags`, {
    method: "POST",
    body: tag,
  });
};

export const updateTag = (id: number, tag: TagRequest) => {
  return fetchClient<TagRequest, Tag>(`/admin/tags/${id}`, {
    method: "PUT",
    body: tag,
  });
};

export const deleteTag = (id: number) => {
  return fetchClient<void, Tag>(`/admin/tags/${id}`, {
    method: "DELETE",
  });
};
