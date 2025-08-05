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
import { ClientTable } from "./client-table"
import { ClientPagination } from "@/features/clients/components/client-pagination"
import { ClientActions } from "@/features/clients/components/client-actions"
import { useSidebar } from "@/shared/components/ui/sidebar"
import { ListLayout } from "@/shared/components/custom-ui/list-layout" 
import { useClientStore } from "@/shared/store/clients.store"

const addClientFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a client name." }),
  identifier: z.string().min(1, { message: "Please enter a client identifier." }),
  description: z.string(),
  homepageurl: z.string(),
  logo: z.any().optional(),
})

export function ClientDashboard() {
  const { toast } = useToast()
  const { state: sidebarState } = useSidebar()
  const { 
    clients, 
    isLoading, 
    error, 
    fetchClients, 
    addClient, 
    removeClient,
    removeMultipleClients 
  } = useClientStore()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

  const isSidebarExpanded = sidebarState === 'expanded';

  React.useEffect(() => {
    fetchClients();
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
    // Map form values to the type expected by the store/API
    const newClientData = {
      name: values.name,
      clientId: values.identifier, // Assuming identifier is clientId
      description: values.description,
      logo: '/images/new-icon.png' // Placeholder logo
    };

    await addClient(newClientData);

    if (!useClientStore.getState().error) {
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
    await removeMultipleClients(selectedIds);
    
    if (!useClientStore.getState().error) {
      setRowSelection({});
      toast({
        title: "Clients deleted",
        description: `${selectedIds.length} client(s) have been deleted.`,
        variant: "destructive"
      })
    }
  }
  
  const handleDeleteRow = async (clientId: string) => {
    await removeClient(clientId);
    if (!useClientStore.getState().error) {
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

  const columns: ColumnDef<Client>[] = [
    // Column definitions will be passed to ClientTable
  ]

  const table = useReactTable({
    data: clients,
    columns: ClientTable.columns(handleDeleteRow),
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

  React.useEffect(() => {
    if (table.getState().columnFilters.length > 0) {
      table.setPageIndex(0);
    }
  }, [table, columnFilters]);

  // Check if empty state
  const isEmpty = !isLoading && clients.length === 0

  return (
    <ListLayout
      loading={isLoading}
      actions={
        <ClientActions 
          table={table}
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
        <ClientTable table={table} columns={ClientTable.columns(handleDeleteRow)} />
      }
      pagination={
        <ClientPagination table={table} />
      }
      emptyState={
        isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No clients found</p>
            <button 
              onClick={() => setAddClientDialogOpen(true)}
              className="text-primary underline"
            >
              Add your first client
            </button>
          </div>
        ) : undefined
      }
    />
  )
}
