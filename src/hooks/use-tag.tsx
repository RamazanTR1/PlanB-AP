import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  getTagList,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "@/services/tag-services";
import type { TagRequest } from "@/types/tag.types";
import { toast } from "sonner";

export const useTagList = (
  search: string,
  page: number,
  size: number,
  sort: string,
) => {
  return useAuthQuery({
    queryKey: ["tag-list", search, page, size, sort],
    queryFn: () => getTagList(search, page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useTagById = (id: number) => {
  return useAuthQuery({
    queryKey: ["tag-by-id", id],
    queryFn: () => getTagById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag: TagRequest) => createTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-list"] });
      toast.success("Tag başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Tag oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdateTag = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag: TagRequest) => updateTag(id, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-list"] });
      queryClient.invalidateQueries({ queryKey: ["tag-by-id", id] });
      toast.success("Tag başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Tag güncellenirken bir hata oluştu");
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag-list"] });
      toast.success("Tag başarıyla silindi");
    },
    onError: () => {
      toast.error("Tag silinirken bir hata oluştu");
    },
  });
};
