import type { Client } from '@/features/clients/types/client.types';
import { clients as mockClients } from '@/features/clients/lib/data';

const API_BASE_URL = 'https://api.identity.dev.ctnp.com';

const MOCK_API_DELAY = 500;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

const getMockClients = async (): Promise<Client[]> => {
  console.log('Fetching mock clients...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockClients);
    }, MOCK_API_DELAY);
  });
};

const createMockClient = async (newClientData: Omit<Client, 'id' | 'status'>): Promise<Client> => {
    console.log('Creating mock client...', newClientData);
    const newClient: Client = {
        id: `client-${Date.now()}`,
        status: 1,
        ...newClientData,
    };
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(newClient);
        }, MOCK_API_DELAY);
    });
};

const deleteMockClient = async (clientId: string): Promise<{ id: string }> => {
    console.log(`Deleting mock client with id: ${clientId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: clientId });
        }, MOCK_API_DELAY);
    });
};

const deleteMultipleMockClients = async (clientIds: string[]): Promise<{ ids: string[] }> => {
    console.log(`Deleting mock clients with ids: ${clientIds.join(', ')}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ ids: clientIds });
        }, MOCK_API_DELAY);
    });
};


// --- REAL API FUNCTIONS ---
// These would be used in production to call a real backend.
// Note: These are examples and will not work without a real API endpoint.

export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('API call failed, falling back to mock data:', error);
    return await getMockClients();
  }
};

export const createClient = async (newClientData: Omit<Client, 'id' | 'status'>): Promise<Client> => {
  // Using mock for now
  return createMockClient(newClientData);
  // const response = await fetch(`${API_BASE_URL}/users`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(newClientData),
  // });
  // return handleResponse<Client>(response);
};

export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete client failed:', error);
    throw error;
  }
};

export const deleteMultipleClients = async (clientIds: string[]): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/batch-delete`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: clientIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete multiple clients failed:', error);
    throw error;
  }
};


export const updateClientStatus = async (
  clientId: string, 
  status: number
): Promise<Client> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: clientId,
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update client status failed:', error);
    throw error;
  }
};

export const getClientById = async (clientId: string): Promise<Client> => {
  try {
    console.log(`🔍 Gọi API tới ${API_BASE_URL}/clients/${clientId}`);
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API trả về client:", data);
    return data;
  } catch (error) {
    console.error("❌ Get client by ID failed:", error);
    console.log("🔧 Falling back to mock data...");
    const mockClient = mockClients.find(client => client.id === clientId);
    if (!mockClient) {
      console.log("❌ Mock client not found for ID:", clientId);
      throw new Error("Client not found");
    }
    console.log("✅ Sử dụng mock client:", mockClient);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return mockClient;
  }
};