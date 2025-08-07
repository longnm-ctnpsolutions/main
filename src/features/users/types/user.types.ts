
export type User = {
  id: string;
  email: string;
  status: 1 | 'inactive';
  connection: 'Email' | 'Google' | 'SAML' | 'Database';
};
