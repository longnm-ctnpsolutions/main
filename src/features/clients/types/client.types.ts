
export type Client = {
  id: string;
  name: string;
  clientId: string;
  status: 'active' | 'inactive';
};

export type Permission = {
  permission: string;
  description: string;
};