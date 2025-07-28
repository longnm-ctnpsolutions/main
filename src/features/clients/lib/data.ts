
import type { Client } from "@/features/clients/types/client.types";

export const clients: Client[] = [
  { id: 'client-1', name: 'Main Web App', clientId: 'a1b2c3d4e5', status: 'active' },
  { id: 'client-2', name: 'iOS App', clientId: 'f6g7h8i9j0', status: 'active' },
  { id: 'client-3', name: 'Android App', clientId: 'k1l2m3n4o5', status: 'active' },
  { id: 'client-4', name: 'Internal Dashboard', clientId: 'p6q7r8s9t0', status: 'inactive' },
  { id: 'client-5', name: 'Marketing Site', clientId: 'u1v2w3x4y5', status: 'active' },
  { id: 'client-6', name: 'API Gateway', clientId: 'z6a7b8c9d0', status: 'active' },
  { id: 'client-7', name: 'Partner Integration', clientId: 'e1f2g3h4i5', status: 'inactive' },
  { id: 'client-8', name: 'Development Server', clientId: 'j6k7l8m9n0', status: 'active' },
  { id: 'client-9', name: 'Staging App', clientId: 'o1p2q3r4s5', status: 'active' },
  { id: 'client-10', name: 'Customer Portal', clientId: 't6u7v8w9x0', status: 'active' },
];
