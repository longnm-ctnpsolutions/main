// "use client"

// import * as React from "react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   getCoreRowModel,
//   useReactTable,
//   type PaginationState,
// } from "@tanstack/react-table"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// import type { Client } from "@/features/clients/types/client.types"
// import { useToast } from "@/shared/hooks/use-toast"
// import { EnhancedClientTable } from "./enhanced-client-table"
// import { ClientActions } from "@/features/clients/components/client-actions"
// import { ClientPagination } from "@/features/clients/components/client-pagination"
// import { useSidebar } from "@/shared/components/ui/sidebar"
// import { ListLayout } from "@/shared/components/custom-ui/list-layout"
// import { useODataClients } from "@/features/clients/hooks/use-odata-clients"

// const addClientFormSchema = z.object({
//   name: z.string().min(1, { message: "Please enter a client name." }),
//   identifier: z.string().min(1, { message: "Please enter a client identifier." }),
//   description: z.string(),
//   homepageurl: z.string(),
//   logo: z.any().optional(),
// })

// export function EnhancedClientDashboard() {
//   const { toast } = useToast()
//   const { state: sidebarState } = useSidebar()
  
//   // Use OData hook instead of context
//   const {
//     clients,
//     isLoading,
//     isActionLoading,
//     error,
//     totalCount,
//     searchTerm,
//     setSearchTerm,
//     fetchClients,
//     addClient,
//     removeClient,
//     removeMultipleClients,
//   } = useODataClients()

//   // Table state
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [pagination, setPagination] = React.useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   })
//   const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

//   const isSidebarExpanded = sidebarState === 'expanded'

//   // Create table state for OData queries
//   const tableState = React.useMemo(() => ({
//     pagination,
//     sorting,
//     columnFilters,
//     globalFilter: searchTerm,
//   }), [pagination, sorting, columnFilters, searchTerm])

//   // Fetch data when table state changes
//   React.useEffect(() => {
//     fetchClients(tableState)
//   }, [fetchClients, tableState])

//   const addClientForm = useForm<z.infer<typeof addClientFormSchema>>({
//     resolver: zodResolver(addClientFormSchema),
//     defaultValues: { 
//       name: "",
//       identifier: "",
//       description: "",
//       homepageurl: "",
//       logo: null,
//     },
//   })

//   const handleAddClient = async (values: z.infer<typeof addClientFormSchema>) => {
//     const newClientData = {
//       name: values.name,
//       clientId: values.identifier,
//       description: values.description,
//       logo: '/images/new-icon.png'
//     }

//     const success = await addClient(newClientData)

//     if (success) {
//       setAddClientDialogOpen(false)
//       addClientForm.reset()
//       // Refresh data to get updated server state
//       fetchClients(tableState)
//       toast({
//         title: "Client added",
//         description: `${values.name} has been added to the client list.`,
//       })
//     }
//   }
  
//   const handleDeleteSelected = async () => {
//     const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)
//     const success = await removeMultipleClients(selectedIds)
    
//     if (success) {
//       setRowSelection({})
//       // Refresh data
//       fetchClients(tableState)
//       toast({
//         title: "Clients deleted",
//         description: `${selectedIds.length} client(s) have been deleted.`,
//         variant: "destructive"
//       })
//     }
//   }
  
//   const handleDeleteRow = async (clientId: string) => {
//     const success = await removeClient(clientId)
//     if (success) {
//       // Refresh data
//       fetchClients(tableState)
//       toast({
//         title: "Client deleted",
//         description: `The client has been deleted.`,
//         variant: "destructive"
//       })
//     }
//   }

//   const handleRefreshData = () => {
//     fetchClients(tableState)
//   }
  
//   React.useEffect(() => {
//     if (error) {
//       toast({
//         title: "An error occurred",
//         description: error,
//         variant: "destructive",
//       })
//     }
//   }, [error, toast])

//   // Custom pagination handlers that work with server-side pagination
//   const handlePaginationChange = React.useCallback((updater: any) => {
//     setPagination(prev => {
//       const newPagination = typeof updater === 'function' ? updater(prev) : updater
//       return newPagination
//     })
//   }, [])

//   // Create table with server-side processing
//   const table = useReactTable({
//     data: clients,
//     columns: EnhancedClientTable.columns(handleDeleteRow),
//     pageCount: Math.ceil(totalCount / pagination.pageSize),
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: handlePaginationChange,
//     getCoreRowModel: getCoreRowModel(),
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//     autoResetPageIndex: false,
//     // Override pagination methods to work with server-side pagination
//     meta: {
//       setPageIndex: (pageIndex: number) => {
//         setPagination(prev => ({ ...prev, pageIndex }))
//       },
//       setPageSize: (pageSize: number) => {
//         setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))
//       },
//     },
//   })

//   // Extend table with custom pagination methods
//   const extendedTable = React.useMemo(() => ({
//     ...table,
//     setPageIndex: (pageIndex: number) => {
//       setPagination(prev => ({ ...prev, pageIndex }))
//     },
//     setPageSize: (pageSize: number) => {
//       setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))
//     },
//     // Override getFilteredRowModel to show correct count
//     getFilteredRowModel: () => ({
//       ...table.getFilteredRowModel(),
//       rows: table.getFilteredRowModel().rows.map((row, index) => ({
//         ...row,
//         // Add global index for display purposes
//         globalIndex: pagination.pageIndex * pagination.pageSize + index
//       }))
//     })
//   }), [table, pagination, setPagination])

//   const isEmpty = !isLoading && clients.length === 0 && totalCount === 0

//   return (
//     <ListLayout
//       actions={
//         <ClientActions 
//           table={table}
//           isLoading={isLoading || isActionLoading}
//           isAddClientDialogOpen={isAddClientDialogOpen}
//           setAddClientDialogOpen={setAddClientDialogOpen}
//           addClientForm={addClientForm}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           onAddClient={handleAddClient}
//           onDeleteSelected={handleDeleteSelected}
//           onRefreshData={handleRefreshData}
//           isSidebarExpanded={isSidebarExpanded}
//         />
//       }
//       tableContent={
//         <EnhancedClientTable 
//           table={table} 
//           columns={EnhancedClientTable.columns(handleDeleteRow)}
//           isLoading={isLoading} 
//         />
//       }
//       pagination={
//         !isEmpty && !isLoading && (
//         <ClientPagination 
//           table={extendedTable as any}
//           totalCount={totalCount}
//         />
//         )
//     }
//       emptyState={
//         isEmpty ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="mx-auto max-w-md">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 48 48"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M34 40v-4a9.971 9.971 0 01-.712-3.714M14 40v-4a9.971 9.971 0 00-.712-3.714"
//                 />
//               </svg>
//               <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 No clients found
//               </h3>
//               <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                 {searchTerm || columnFilters.length > 0 
//                   ? "Try adjusting your search or filters to find what you're looking for."
//                   : "Get started by adding your first client to the system."
//                 }
//               </p>
//               {(!searchTerm && columnFilters.length === 0) && (
//                 <button 
//                   onClick={() => setAddClientDialogOpen(true)}
//                   className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
//                 >
//                   Add your first client
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : undefined
//       }
//     />
//   )
// }


"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Client } from "@/features/clients/types/client.types"
import { useToast } from "@/shared/hooks/use-toast"
import { EnhancedClientTable } from "./enhanced-client-table"
import { ClientActions } from "@/features/clients/components/client-actions"
import { ClientPagination } from "@/features/clients/components/client-pagination"
import { useSidebar } from "@/shared/components/ui/sidebar"
import { ListLayout } from "@/shared/components/custom-ui/list-layout"
// ✅ CHANGED: Import context hooks instead of old hook
import { useClientsActions } from "@/shared/context/clients-context"

const addClientFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a client name." }),
  identifier: z.string().min(1, { message: "Please enter a client identifier." }),
  description: z.string(),
  homepageurl: z.string(),
  logo: z.any().optional(),
})

export function EnhancedClientDashboard() {
  const { toast } = useToast()
  const { state: sidebarState } = useSidebar()
  
  // ✅ CHANGED: Use context hooks instead of old hook
  const {
    clients,
    isLoading,
    isActionLoading,
    error,
    totalCount,
    hasMore,
    searchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
    fetchClients,
    addClient,
    removeClient,
    removeMultipleClients,
  } = useClientsActions()

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

  const isSidebarExpanded = sidebarState === 'expanded'

  // Create table state for OData queries
  const tableState = React.useMemo(() => ({
    pagination,
    sorting,
    columnFilters,
    globalFilter: searchTerm,
  }), [pagination, sorting, columnFilters, searchTerm])

  // Fetch data when table state changes
  React.useEffect(() => {
    fetchClients(tableState)
  }, [fetchClients, tableState])

  const addClientForm = useForm<z.infer<typeof addClientFormSchema>>({
    resolver: zodResolver(addClientFormSchema),
    defaultValues: { 
      name: "",
      identifier: "",
      description: "",
      homepageurl: "",
      logo: null,
    },
  })

  const handleAddClient = async (values: z.infer<typeof addClientFormSchema>) => {
    const newClientData = {
      name: values.name,
      clientId: values.identifier,
      description: values.description,
      logo: '/images/new-icon.png'
    }

    const success = await addClient(newClientData)

    if (success) {
      setAddClientDialogOpen(false)
      addClientForm.reset()
      // ✅ IMPROVED: Context handles this automatically, no need to manually refetch
      // fetchClients(tableState) // Remove this - context will handle updates
      toast({
        title: "Client added",
        description: `${values.name} has been added to the client list.`,
      })
    }
  }
  
  const handleDeleteSelected = async () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)
    const success = await removeMultipleClients(selectedIds)
    
    if (success) {
      setRowSelection({})
      // ✅ IMPROVED: Context handles this automatically, no need to manually refetch
      // fetchClients(tableState) // Remove this - context will handle updates
      toast({
        title: "Clients deleted",
        description: `${selectedIds.length} client(s) have been deleted.`,
        variant: "destructive"
      })
    }
  }
  
  const handleDeleteRow = async (clientId: string) => {
    const success = await removeClient(clientId)
    if (success) {
      // ✅ IMPROVED: Context handles this automatically, no need to manually refetch
      // fetchClients(tableState) // Remove this - context will handle updates
      toast({
        title: "Client deleted",
        description: `The client has been deleted.`,
        variant: "destructive"
      })
    }
  }

  const handleRefreshData = () => {
    fetchClients(tableState)
  }
  
  // ✅ IMPROVED: Better error handling with context
  React.useEffect(() => {
    if (error) {
      toast({
        title: "An error occurred",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Custom pagination handlers that work with server-side pagination
  const handlePaginationChange = React.useCallback((updater: any) => {
    setPagination(prev => {
      const newPagination = typeof updater === 'function' ? updater(prev) : updater
      return newPagination
    })
  }, [])

  // Create table with server-side processing
  const table = useReactTable({
    data: clients,
    columns: EnhancedClientTable.columns(handleDeleteRow),
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: false,
    // Override pagination methods to work with server-side pagination
    meta: {
      setPageIndex: (pageIndex: number) => {
        setPagination(prev => ({ ...prev, pageIndex }))
      },
      setPageSize: (pageSize: number) => {
        setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))
      },
    },
  })

  // Extend table with custom pagination methods
  const extendedTable = React.useMemo(() => ({
    ...table,
    setPageIndex: (pageIndex: number) => {
      setPagination(prev => ({ ...prev, pageIndex }))
    },
    setPageSize: (pageSize: number) => {
      setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))
    },
    // Override getFilteredRowModel to show correct count
    getFilteredRowModel: () => ({
      ...table.getFilteredRowModel(),
      rows: table.getFilteredRowModel().rows.map((row, index) => ({
        ...row,
        // Add global index for display purposes
        globalIndex: pagination.pageIndex * pagination.pageSize + index
      }))
    })
  }), [table, pagination, setPagination])

  const isEmpty = !isLoading && clients.length === 0 && totalCount === 0

  return (
    <ListLayout
      actions={
        <ClientActions 
          table={table}
          isLoading={isLoading || isActionLoading}
          isAddClientDialogOpen={isAddClientDialogOpen}
          setAddClientDialogOpen={setAddClientDialogOpen}
          addClientForm={addClientForm}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClient={handleAddClient}
          onDeleteSelected={handleDeleteSelected}
          onRefreshData={handleRefreshData}
          isSidebarExpanded={isSidebarExpanded}
          // ✅ REMOVED: These props don't exist in ClientActionsProps yet
          // clearSearch={clearSearch}
          // isSearching={isSearching}
        />
      }
      tableContent={
        <EnhancedClientTable 
          table={table} 
          columns={EnhancedClientTable.columns(handleDeleteRow)}
          isLoading={isLoading} 
        />
      }
      pagination={
        !isEmpty && !isLoading && (
          <ClientPagination 
            table={extendedTable as any}
            totalCount={totalCount}
            // ✅ REMOVED: hasMore prop doesn't exist in ClientPaginationProps yet
            // hasMore={hasMore}
          />
        )
      }
      emptyState={
        isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M34 40v-4a9.971 9.971 0 01-.712-3.714M14 40v-4a9.971 9.971 0 00-.712-3.714"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                No clients found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {/* ✅ IMPROVED: Use isSearching from context */}
                {isSearching || columnFilters.length > 0 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Get started by adding your first client to the system."
                }
              </p>
              {/* ✅ IMPROVED: Use isSearching from context */}
              {(!isSearching && columnFilters.length === 0) && (
                <button 
                  onClick={() => setAddClientDialogOpen(true)}
                  className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Add your first client
                </button>
              )}
            </div>
          </div>
        ) : undefined
      }
    />
  )
}