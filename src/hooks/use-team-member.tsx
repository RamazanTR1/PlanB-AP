import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
  getTeamMemberList,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/services/team-member-services";
import type { TeamMemberRequest } from "@/types/team-member-types";
import { toast } from "sonner";

export const useTeamMemberList = (page: number, size: number, sort: string) => {
  return useAuthQuery({
    queryKey: ["team-member-list", page, size, sort],
    queryFn: () => getTeamMemberList(page, size, sort),
    staleTime: 2 * 60 * 1000,
  });
};

export const useTeamMemberById = (id: number) => {
  return useAuthQuery({
    queryKey: ["team-member-by-id", id],
    queryFn: () => getTeamMemberById(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMember: TeamMemberRequest) => createTeamMember(teamMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-list"] });
      toast.success("Takım üyesi başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Takım üyesi oluşturulurken bir hata oluştu");
    },
  });
};

export const useUpdateTeamMember = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMember: TeamMemberRequest) =>
      updateTeamMember(id, teamMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-list"] });
      queryClient.invalidateQueries({ queryKey: ["team-member-by-id", id] });
      toast.success("Takım üyesi başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Takım üyesi güncellenirken bir hata oluştu");
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-list"] });
      toast.success("Takım üyesi başarıyla silindi");
    },
    onError: () => {
      toast.error("Takım üyesi silinirken bir hata oluştu");
    },
  });
};
