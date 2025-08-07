"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Client } from "@/features/clients/types/client.types"
import { useToast } from "@/shared/hooks/use-toast"
import { EnhancedClientTable } from "./enhanced-client-table"
import { ClientPagination } from "@/features/clients/components/client-pagination"
import { ClientActions } from "@/features/clients/components/client-actions"
import { useSidebar } from "@/shared/components/ui/sidebar"
import { ListLayout } from "@/shared/components/custom-ui/list-layout"
import { useClients } from "@/shared/context/clients-context" // Use the new context hook

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
  
  // Get state and actions from the new context
  const { state, addClient, removeClient, removeMultipleClients, fetchClients } = useClients()
  const { clients, isLoading, error } = state

  // Local UI state remains in the component
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

  const isSidebarExpanded = sidebarState === 'expanded';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients();
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchClients]);

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
    };

    const success = await addClient(newClientData);

    if (success) {
      setAddClientDialogOpen(false)
      addClientForm.reset()
      toast({
        title: "Client added",
        description: `${values.name} has been added to the client list.`,
      })
    }
  }
  
  const handleDeleteSelected = async () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    const success = await removeMultipleClients(selectedIds);
    
    if (success) {
      setRowSelection({});
      toast({
        title: "Clients deleted",
        description: `${selectedIds.length} client(s) have been deleted.`,
        variant: "destructive"
      })
    }
  }
  
  const handleDeleteRow = async (clientId: string) => {
    const success = await removeClient(clientId);
    if (success) {
      toast({
        title: "Client deleted",
        description: `The client has been deleted.`,
        variant: "destructive"
      })
    }
  }
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: "An error occurred",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Create table with enhanced columns
  const table = useReactTable({
    data: clients,
    columns: EnhancedClientTable.columns(handleDeleteRow),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Reset page when filters change
  React.useEffect(() => {
    if (table.getState().columnFilters.length > 0) {
      table.setPageIndex(0)
    }
  }, [table, columnFilters])

  // Check if empty state
  const isEmpty = !isLoading && clients.length === 0
  const hasSelectedRows = Object.keys(rowSelection).length > 0

  return (
    <ListLayout
      loading={isLoading}
      actions={
        <ClientActions 
          table={table}
          isLoading={isLoading}
          isAddClientDialogOpen={isAddClientDialogOpen}
          setAddClientDialogOpen={setAddClientDialogOpen}
          addClientForm={addClientForm}
          onAddClient={handleAddClient}
          onDeleteSelected={handleDeleteSelected}
          onRefreshData={fetchClients}
          isSidebarExpanded={isSidebarExpanded}
        />
      }
      tableContent={
        <EnhancedClientTable 
          table={table} 
          columns={EnhancedClientTable.columns(handleDeleteRow)} 
        />
      }
      pagination={
        !isEmpty && <ClientPagination table={table} />
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
                No clients yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Get started by adding your first client to the system.
              </p>
              <button 
                onClick={() => setAddClientDialogOpen(true)}
                className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Add your first client
              </button>
            </div>
          </div>
        ) : undefined
      }
    />
  )
}
