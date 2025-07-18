
export type User = {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  connection: 'Email' | 'Google' | 'SAML' | 'Database';
};

export const users: User[] = [
  { id: 'user-1', email: 'olivia.martin@email.com', status: 'active', connection: 'Database' },
  { id: 'user-2', email: 'jackson.lee@email.com', status: 'active', connection: 'Google' },
  { id: 'user-3', email: 'isabella.nguyen@email.com', status: 'active', connection: 'SAML' },
  { id: 'user-4', email: 'william.kim@email.com', status: 'inactive', connection: 'Database' },
  { id: 'user-5', email: 'sofia.davis@email.com', status: 'active', connection: 'Email' },
  { id: 'user-6', email: 'liam.johnson@email.com', status: 'active', connection: 'Google' },
  { id: 'user-7', email: 'ava.williams@email.com', status: 'inactive', connection: 'Database' },
  { id: 'user-8', email: 'noah.brown@email.com', status: 'active', connection: 'SAML' },
  { id: 'user-9', email: 'emma.jones@email.com', status: 'active', connection: 'Email' },
  { id: 'user-10', email: 'james.miller@email.com', status: 'active', connection: 'Google' },
  { id: 'user-11', email: 'charlotte.wilson@email.com', status: 'active', connection: 'Database' },
  { id: 'user-12', email: 'benjamin.moore@email.com', status: 'inactive', connection: 'Email' },
  { id: 'user-13', email: 'amelia.taylor@email.com', status: 'active', connection: 'SAML' },
  { id: 'user-14', email: 'lucas.anderson@email.com', status: 'active', connection: 'Google' },
  { id: 'user-15', email: 'mia.thomas@email.com', status: 'active', connection: 'Database' },
];
