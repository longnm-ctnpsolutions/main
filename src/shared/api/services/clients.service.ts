import type { Client } from '@/features/clients/types/client.types';
import api from '@/shared/api/axios-instance';
import { clients as mockClients } from '@/features/clients/lib/data';

// In a real application, these functions would make API calls.
// For now, they simulate API calls with a delay and use mock data.

const MOCK_API_DELAY = 500;

export const getClients = async (): Promise<Client[]> => {
  console.log('Fetching clients...');
  // Simulate API call
  // const response = await api.get<Client[]>('/clients');
  // return response.data;

  // Mock implementation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockClients);
    }, MOCK_API_DELAY);
  });
};

export const createClient = async (newClientData: Omit<Client, 'id' | 'status'>): Promise<Client> => {
  console.log('Creating client...', newClientData);
  // Simulate API call
  // const response = await api.post<Client>('/clients', newClientData);
  // return response.data;
  
  // Mock implementation
  const newClient: Client = {
    id: `client-${Date.now()}`,
    name: newClientData.name,
    clientId: newClientData.clientId,
    description: newClientData.description,
    logo: newClientData.logo,
    status: 'active',
  };

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(newClient);
    }, MOCK_API_DELAY);
  });
};

export const deleteClient = async (clientId: string): Promise<void> => {
    console.log(`Deleting client with id: ${clientId}`);
    // Simulate API call
    // await api.delete(`/clients/${clientId}`);

    // Mock implementation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, MOCK_API_DELAY);
    });
};

export const deleteMultipleClients = async (clientIds: string[]): Promise<void> => {
    console.log(`Deleting clients with ids: ${clientIds.join(', ')}`);
    // Simulate API call
    // await api.post('/clients/batch-delete', { ids: clientIds });

    // Mock implementation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, MOCK_API_DELAY);
    });
};