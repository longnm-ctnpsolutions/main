import type { Client } from '@/features/clients/types/client.types';
import type { ODataResponse, TableState } from '@/types/odata.types';
import { ODataQueryBuilder } from '@/lib/odata-builder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7060';

export interface ClientsQueryResult {
  clients: Client[];
  totalCount: number;
  hasMore: boolean;
}

export const getClientsWithOData = async (
  tableState: TableState,
  searchTerm?: string
): Promise<ClientsQueryResult> => {
  try {
    const queryBuilder = new ODataQueryBuilder();
    
    // Select specific fields (optional - remove if you want all fields)
    // queryBuilder.select(['id', 'name', 'clientId', 'status', 'logo', 'description']);
    
    // Build filter conditions
    const filterConditions: string[] = [];
    
    // Global search across multiple fields
    if (searchTerm && searchTerm.trim()) {
      const searchConditions = [
        ODataQueryBuilder.contains('name', searchTerm),
        ODataQueryBuilder.contains('description', searchTerm),
        ODataQueryBuilder.contains('clientId', searchTerm)
      ].filter(Boolean);
      
      if (searchConditions.length > 0) {
        filterConditions.push(`(${searchConditions.join(' or ')})`);
      }
    }
    
    // Column-specific filters
    tableState.columnFilters.forEach(filter => {
      switch (filter.id) {
        case 'name':
          if (filter.value) {
            filterConditions.push(ODataQueryBuilder.contains('name', filter.value));
          }
          break;
        case 'status':
          if (filter.value !== undefined && filter.value !== '') {
            filterConditions.push(ODataQueryBuilder.equals('status', filter.value));
          }
          break;
        case 'description':
          if (filter.value) {
            filterConditions.push(ODataQueryBuilder.contains('description', filter.value));
          }
          break;
        // Add more column filters as needed
      }
    });
    
    queryBuilder.filter(filterConditions);
    
    // Sorting
    if (tableState.sorting.length > 0) {
      const sort = tableState.sorting[0]; // Take first sort only
      queryBuilder.orderBy(sort.id, sort.desc ? 'desc' : 'asc');
    }
    
    // Pagination
    const skip = tableState.pagination.pageIndex * tableState.pagination.pageSize;
    queryBuilder.skip(skip).top(tableState.pagination.pageSize);
    
    // Include total count
    queryBuilder.count(true);
    
    const queryString = queryBuilder.build();
    const url = `${API_BASE_URL}/clients${queryString ? `?${queryString}` : ''}`;
    
    console.log('OData URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ODataResponse<Client> = await response.json();
    
    return {
      clients: data.value || [],
      totalCount: data['@odata.count'] || data.value?.length || 0,
      hasMore: !!data['@odata.nextLink'],
    };
    
  } catch (error) {
    console.error('OData API call failed:', error);
    throw error;
  }
};