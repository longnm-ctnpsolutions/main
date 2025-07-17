export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  connection: 'Email' | 'Google' | 'SAML';
};

export const users: User[] = [
  {
    id: "user-1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/40x40?text=OM",
    status: "active",
    connection: "Google",
  },
  {
    id: "user-2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/40x40?text=JL",
    status: "active",
    connection: "Email",
  },
  {
    id: "user-3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/40x40?text=IN",
    status: "inactive",
    connection: "SAML",
  },
  {
    id: "user-4",
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://placehold.co/40x40?text=WK",
    status: "active",
    connection: "Email",
  },
  {
    id: "user-5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/40x40?text=SD",
    status: "active",
    connection: "Google",
  },
  {
    id: "user-6",
    name: "Liam Garcia",
    email: "liam.garcia@email.com",
    avatar: "https://placehold.co/40x40?text=LG",
    status: "inactive",
    connection: "Email",
  },
   {
    id: "user-7",
    name: "Ava Rodriguez",
    email: "ava.rodriguez@email.com",
    avatar: "https://placehold.co/40x40?text=AR",
    status: "active",
    connection: "SAML",
  },
  {
    id: "user-8",
    name: "Noah Martinez",
    email: "noah.martinez@email.com",
    avatar: "https://placehold.co/40x40?text=NM",
    status: "active",
    connection: "Google",
  },
  {
    id: "user-9",
    name: "Emma Brown",
    email: "emma.brown@email.com",
    avatar: "https://placehold.co/40x40?text=EB",
    status: "inactive",
    connection: "Email",
  },
   {
    id: "user-10",
    name: "James Wilson",
    email: "james.wilson@email.com",
    avatar: "https://placehold.co/40x40?text=JW",
    status: "active",
    connection: "Email",
  },
];
