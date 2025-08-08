import { fetchClient } from "@/utils/fetch-client";
import type {
  TeamMemberList,
  TeamMemberRequest,
  TeamMember,
} from "@/types/team-member-types";

export const getTeamMemberList = async (
  page: number,
  size: number,
  sort: string,
) => {
  return await fetchClient<void, TeamMemberList>(
    `/team-members?page=${page}&size=${size}&sort=${sort}`,
    {
      method: "GET",
    },
  );
};

export const getTeamMemberById = async (id: number) => {
  return await fetchClient<void, TeamMember>(`/team-members/${id}`, {
    method: "GET",
  });
};

export const createTeamMember = async (teamMember: TeamMemberRequest) => {
  return await fetchClient<TeamMemberRequest, TeamMember>(
    "/admin/team-members",
    {
      method: "POST",
      body: teamMember,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const updateTeamMember = async (
  id: number,
  teamMember: TeamMemberRequest,
) => {
  return await fetchClient<TeamMemberRequest, TeamMember>(
    `/admin/team-members/${id}`,
    {
      method: "PUT",
      body: teamMember,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const deleteTeamMember = async (id: number) => {
  return await fetchClient<void, void>(`/admin/team-members/${id}`, {
    method: "DELETE",
  });
};
