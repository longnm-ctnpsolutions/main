import * as React from 'react';
import type { Client } from '@/features/clients/types/client.types';
import type { TableState } from '@/types/odata.types';
import { getClientsWithOData, type ClientsQueryResult } from "@/services/clients-odata.service";
import {
  createClient,
  deleteClient,
  deleteMultipleClients,
} from '@/shared/api/services/clients.service';

interface ODataClientsState {
  clients: Client[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: ClientsQueryResult }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Client }
  | { type: 'REMOVE_SUCCESS'; payload: { id: string } }
  | { type: 'REMOVE_MULTIPLE_SUCCESS'; payload: { ids: string[] } }
  | { type: 'SET_ACTION_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const odataClientsReducer = (state: ODataClientsState, action: Action): ODataClientsState => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        clients: action.payload.clients,
        totalCount: action.payload.totalCount,
        hasMore: action.payload.hasMore
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { 
        ...state, 
        clients: [action.payload, ...state.clients],
        totalCount: state.totalCount + 1 
      };
    case 'REMOVE_SUCCESS':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload.id),
        totalCount: state.totalCount - 1,
        isActionLoading: false,
      };
    case 'REMOVE_MULTIPLE_SUCCESS':
      return {
        ...state,
        clients: state.clients.filter(client => !action.payload.ids.includes(client.id)),
        totalCount: state.totalCount - action.payload.ids.length,
        isActionLoading: false,
      };
    case 'SET_ACTION_LOADING':
      return { ...state, isActionLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isActionLoading: false };
    default:
      return state;
  }
};

const initialState: ODataClientsState = {
  clients: [],
  isLoading: false,
  isActionLoading: false,
  error: null,
  totalCount: 0,
  hasMore: false,
};

// Custom debounce hook
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useODataClients = (debounceDelay: number = 300) => {
  const [state, dispatch] = React.useReducer(odataClientsReducer, initialState);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Use custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  
  // Store the current table state to re-fetch when search changes
  const [currentTableState, setCurrentTableState] = React.useState<TableState | null>(null);

  // Memoized fetch function that doesn't depend on debouncedSearchTerm directly
  const fetchClientsInternal = React.useCallback(async (tableState: TableState, searchQuery: string) => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const result = await getClientsWithOData(tableState, searchQuery);
      dispatch({ type: 'FETCH_SUCCESS', payload: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
    }
  }, []);

  // Effect to handle debounced search
  React.useEffect(() => {
    if (currentTableState) {
      fetchClientsInternal(currentTableState, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, currentTableState, fetchClientsInternal]);

  // Main fetch function that updates table state and triggers fetch
  const fetchClients = React.useCallback(async (tableState: TableState) => {
    setCurrentTableState(tableState);
    await fetchClientsInternal(tableState, debouncedSearchTerm);
  }, [fetchClientsInternal, debouncedSearchTerm]);

  // Clear search function
  const clearSearch = React.useCallback(() => {
    setSearchTerm('');
  }, []);

  // Check if search is active
  const isSearching = React.useMemo(() => {
    return searchTerm.trim().length > 0;
  }, [searchTerm]);

  const addClient = React.useCallback(async (newClientData: Omit<Client, 'id' | 'status'>) => {
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
  }, []);

  const removeClient = React.useCallback(async (clientId: string) => {
    // Optimistic update
    const originalState = { ...state };
    dispatch({ type: 'REMOVE_SUCCESS', payload: { id: clientId } });
    dispatch({ type: 'SET_ACTION_LOADING', payload: true });
    
    try {
      await deleteClient(clientId);
      dispatch({ type: 'SET_ACTION_LOADING', payload: false });
      return true;
    } catch (error) {
      // Rollback
      dispatch({ type: 'FETCH_SUCCESS', payload: {
        clients: originalState.clients,
        totalCount: originalState.totalCount,
        hasMore: originalState.hasMore
      }});
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  }, [state]);
  
  const removeMultipleClients = React.useCallback(async (clientIds: string[]) => {
    // Optimistic update
    const originalState = { ...state };
    dispatch({ type: 'REMOVE_MULTIPLE_SUCCESS', payload: { ids: clientIds } });
    dispatch({ type: 'SET_ACTION_LOADING', payload: true });
    
    try {
      await deleteMultipleClients(clientIds);
      dispatch({ type: 'SET_ACTION_LOADING', payload: false });
      return true;
    } catch (error) {
      // Rollback
      dispatch({ type: 'FETCH_SUCCESS', payload: {
        clients: originalState.clients,
        totalCount: originalState.totalCount,
        hasMore: originalState.hasMore
      }});
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      return false;
    }
  }, [state]);

  return {
    ...state,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    clearSearch,
    isSearching,
    fetchClients,
    addClient,
    removeClient,
    removeMultipleClients,
  };
};