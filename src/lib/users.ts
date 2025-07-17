
export type User = {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  connection: 'Email' | 'Google' | 'SAML' | 'Database';
};

export const users: User[] = [
  {
    id: "user-haunt",
    email: "haunt@ctnpsolutions.com",
    status: "active",
    connection: "Database",
  },
];

    