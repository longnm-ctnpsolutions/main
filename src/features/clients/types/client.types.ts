
export type Client = {
  id: string;
  name: string;
  clientId: string;
  status: number | string;
  logo?: string;
  description?: string;
};

export type Permission = {
  permission: string;
  description: string;
};