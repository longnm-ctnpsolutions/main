
import type { Client } from "@/features/clients/types/client.types";

export const clients: Client[] = [
  { 
    id: 'client-1', 
    name: 'Activation', 
    clientId: 'a1b2c3d4e5', 
    status: 'active',
    logo: '/images/activation.png',
    description: 'Manage and track the activation of systems, services, or products with support for requests, approvals, and status monitoring.'
  },
  { 
    id: 'client-2', 
    name: 'ClaimTire', 
    clientId: 'f6g7h8i9j0', 
    status: 'active',
    logo: '/images/claimtire.png',
    description: 'Support tire-related claim submissions, tracking, and resolution management.'
  },
  { 
    id: 'client-3', 
    name: 'Fleet Approach', 
    clientId: 'k1l2m3n4o5', 
    status: 'active',
    logo: '/images/fleet-approach.png',
    description: 'Enable streamlined operations and insights for fleet-related activities and services.'
  },
  { 
    id: 'client-4', 
    name: 'Portal Identity', 
    clientId: 'p6q7r8s9t0', 
    status: 'active',
    logo: '/images/portal-identity.png',
    description: 'A centralized application for managing user identities, roles, permissions, and client configurations across integrated systems.'
  },
  { 
    id: 'client-5', 
    name: 'Web Order for Dealer', 
    clientId: 'u1v2w3x4y5', 
    status: 'active',
    logo: '/images/web-order.png',
    description: 'Place, track, and manage orders through the integrated online ordering system.'
  },
];
