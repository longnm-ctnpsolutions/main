import { create } from 'zustand';
import type { Client } from '@/features/clients/types/client.types';
import { 
  getClients as getClientsApi, 
  createClient as createClientApi,
  deleteClient as deleteClientApi,
  deleteMultipleClients as deleteMultipleClientsApi,
} from '@/shared/api/services/clients.service';

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (newClientData: Omit<Client, 'id' | 'status'>) => Promise<void>;
  removeClient: (clientId: string) => Promise<void>;
  removeMultipleClients: (clientIds: string[]) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await getClientsApi();
      set({ clients, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ isLoading: false, error: errorMessage });
    }
  },

  addClient: async (newClientData) => {
    set({ isLoading: true });
    try {
      const newClient = await createClientApi(newClientData);
      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false,
      }));
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ isLoading: false, error: errorMessage });
    }
  },

  removeClient: async (clientId: string) => {
    // Optimistic update
    const originalClients = get().clients;
    set(state => ({
        clients: state.clients.filter(client => client.id !== clientId)
    }));

    try {
        await deleteClientApi(clientId);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        // Rollback on error
        set({ clients: originalClients, error: errorMessage });
    }
  },
  
  removeMultipleClients: async (clientIds: string[]) => {
    // Optimistic update
    const originalClients = get().clients;
    set(state => ({
        clients: state.clients.filter(client => !clientIds.includes(client.id))
    }));

    try {
        await deleteMultipleClientsApi(clientIds);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        // Rollback on error
        set({ clients: originalClients, error: errorMessage });
    }
  }
}));
