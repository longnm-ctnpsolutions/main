// 1. Cải thiện Context để có better loading state
"use client";

import * as React from 'react';
import type { Client } from '@/features/clients/types/client.types';
import {
  getClients,
  createClient,
  deleteClient,
  deleteMultipleClients,
} from '@/shared/api/services/clients/clients.service';

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  isActionLoading: boolean; // Thêm state riêng cho actions
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
  | { type: 'SET_ACTION_LOADING'; payload: boolean } // New action
  | { type: 'SET_ERROR'; payload: string | null };

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
        isActionLoading: false,
      };
    case 'REMOVE_MULTIPLE_SUCCESS':
       return {
        ...state,
        clients: state.clients.filter(client => !action.payload.ids.includes(client.id)),
        isActionLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ACTION_LOADING':
      return { ...state, isActionLoading: action.payload };
    case 'SET_ERROR':
        return { ...state, error: action.payload, isLoading: false, isActionLoading: false };
    default:
      return state;
  }
};

const initialState: ClientsState = {
  clients: [],
  isLoading: false,
  isActionLoading: false,
  error: null,
};

interface ClientsContextType {
  state: ClientsState;
  fetchClients: () => Promise<void>;
  addClient: (newClientData: Omit<Client, 'id' | 'status'>) => Promise<boolean>;
  removeClient: (clientId: string) => Promise<boolean>;
  removeMultipleClients: (clientIds: string[]) => Promise<boolean>;
}

const ClientsContext = React.createContext<ClientsContextType | undefined>(undefined);

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
    dispatch({ type: 'SET_ACTION_LOADING', payload: true });
    try {
      const newClient = await createClient(newClientData);
      dispatch({ type: 'ADD_SUCCESS', payload: newClient });
      dispatch({ type: 'SET_ACTION_LOADING', payload: false });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };

  const removeClient = async (clientId: string) => {
    // Optimistic update để tránh layout shift
    const originalClients = state.clients;
    dispatch({ type: 'REMOVE_SUCCESS', payload: { id: clientId } });
    dispatch({ type: 'SET_ACTION_LOADING', payload: true });
    
    try {
      await deleteClient(clientId);
      dispatch({ type: 'SET_ACTION_LOADING', payload: false });
      return true;
    } catch (error) {
      // Rollback nếu thất bại
      dispatch({ type: 'FETCH_SUCCESS', payload: originalClients });
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  };
  
  const removeMultipleClients = async (clientIds: string[]) => {
    // Optimistic update
    const originalClients = state.clients;
    dispatch({ type: 'REMOVE_MULTIPLE_SUCCESS', payload: { ids: clientIds } });
    dispatch({ type: 'SET_ACTION_LOADING', payload: true });
    
    try {
      await deleteMultipleClients(clientIds);
      dispatch({ type: 'SET_ACTION_LOADING', payload: false });
      return true;
    } catch (error) {
      // Rollback
      dispatch({ type: 'FETCH_SUCCESS', payload: originalClients });
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

export const useClients = (): ClientsContextType => {
  const context = React.useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};