import { fetchClient } from "@/utils/fetch-client";
import type {
  ContactList,
  Contact,
  ContactRequest,
} from "@/types/contact.types";

export const getContactList = async (
  page: number,
  size: number,
  sort: string,
) => {
  return fetchClient<void, ContactList>(
    `/admin/contact?page=${page}&size=${size}&sort=${sort}`,
  );
};

export const createContact = async (contactInfo: ContactRequest) => {
  return fetchClient<ContactRequest, Contact>(`/contact`, {
    method: "POST",
    body: contactInfo,
  });
};

export const deleteContact = async (contactId: number) => {
  return fetchClient<void, void>(`/admin/contact/${contactId}`, {
    method: "DELETE",
  });
};
