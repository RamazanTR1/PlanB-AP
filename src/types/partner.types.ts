export interface PartnerRequest {
  name: string;
  icon?: File; // file to upload (multipart/form-data)
}

export interface Partner {
  id: number;
  name: string;
  icon: string;
}
