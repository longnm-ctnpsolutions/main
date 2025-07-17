export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  connection: 'Email' | 'Google' | 'SAML' | 'Database';
  lastSeen: string;
};

export const users: User[] = [
  {
    id: "user-1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/40x40?text=OM",
    status: "active",
    connection: "Google",
    lastSeen: "2 hours ago",
  },
  {
    id: "user-2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/40x40?text=JL",
    status: "active",
    connection: "Email",
    lastSeen: "5 hours ago",
  },
  {
    id: "user-3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/40x40?text=IN",
    status: "inactive",
    connection: "SAML",
    lastSeen: "3 days ago",
  },
  {
    id: "user-4",
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://placehold.co/40x40?text=WK",
    status: "active",
    connection: "Email",
    lastSeen: "1 hour ago",
  },
  {
    id: "user-5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/40x40?text=SD",
    status: "active",
    connection: "Google",
    lastSeen: "10 minutes ago",
  },
  {
    id: "user-haunt",
    name: "Hau NT",
    email: "haunt@ctnpsolutions.com",
    avatar: "https://placehold.co/40x40?text=HN",
    status: "active",
    connection: "Database",
    lastSeen: "Just now",
  },
];
