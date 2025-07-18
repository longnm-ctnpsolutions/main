
export type User = {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  connection: 'Email' | 'Google' | 'SAML' | 'Database';
};
