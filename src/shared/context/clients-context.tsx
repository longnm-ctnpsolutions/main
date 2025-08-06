"use client";

import * as React from 'react';
import type { Client } from '@/features/clients/types/client.types';
import {
  getClients,
  createClient,
  deleteClient,
  deleteMultipleClients,
} from '@/shared/api/services/clients.service';

// 1. Define State and Action Types
interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: Client[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Client }
  | { type: 'REMOVE_SUCCESS'; payload: { id: string } }
  | { type: 'REMOVE_MULTIPLE_SUCCESS'; payload: { ids: string[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 2. Create a Reducer function
const clientsReducer = (state: ClientsState, action: Action): ClientsState => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, clients: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { ...state, clients: [action.payload, ...state.clients] };
    case 'REMOVE_SUCCESS':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload.id),
      };
    case 'REMOVE_MULTIPLE_SUCCESS':
       return {
        ...state,
        clients: state.clients.filter(client => !action.payload.ids.includes(client.id)),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
        return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// 3. Create the Context
interface ClientsContextType {
  state: ClientsState;
  fetchClients: () => Promise<void>;
  addClient: (newClientData: Omit<Client, 'id' | 'status'>) => Promise<boolean>;
  removeClient: (clientId: string) => Promise<boolean>;
  removeMultipleClients: (clientIds: string[]) => Promise<boolean>;
}

const ClientsContext = React.createContext<ClientsContextType | undefined>(undefined);

// 4. Create a Provider Component
const initialState: ClientsState = {
  clients: [],
  isLoading: false,
  error: null,
};

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(clientsReducer, initialState);

  const fetchClients = React.useCallback(async () => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const clientsData = await getClients();
      dispatch({ type: 'FETCH_SUCCESS', payload: clientsData });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
    }
  }, []);

  const addClient = async (newClientData: Omit<Client, 'id' | 'status'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newClient = await createClient(newClientData);
      dispatch({ type: 'ADD_SUCCESS', payload: newClient });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  const removeClient = async (clientId: string) => {
     // Note: No optimistic update here to keep it simple with context.
     // Could be added by caching the state before dispatching.
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
        const result = await deleteClient(clientId);
        dispatch({ type: 'REMOVE_SUCCESS', payload: { id: result.id } });
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch({ type: 'SET_ERROR', payload: message });
        return false;
    }
  };
  
  const removeMultipleClients = async (clientIds: string[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
     try {
        const result = await deleteMultipleClients(clientIds);
        dispatch({ type: 'REMOVE_MULTIPLE_SUCCESS', payload: { ids: result.ids } });
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch({ type: 'SET_ERROR', payload: message });
        return false;
    }
  };


  const value = React.useMemo(() => ({
    state,
    fetchClients,
    addClient,
    removeClient,
    removeMultipleClients,
  }), [state, fetchClients]);

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
};

// 5. Create a custom hook to use the context
export const useClients = (): ClientsContextType => {
  const context = React.useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
