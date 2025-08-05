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
import { clients as defaultClients } from "@/features/clients/lib/data"
import { useToast } from "@/shared/hooks/use-toast"
import { EnhancedClientTable } from "./enhanced-client-table"
import { ClientPagination } from "@/features/clients/components/client-pagination"
import { ClientActions } from "@/features/clients/components/client-actions"
import { useSidebar } from "@/shared/components/ui/sidebar"
import { ListLayout } from "@/shared/components/custom-ui/list-layout"

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
  const [clients, setClients] = React.useState<Client[]>(defaultClients)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

  const isSidebarExpanded = sidebarState === 'expanded'

  // Add refresh function for ClientActions
  const handleRefreshData = React.useCallback(() => {
    // Reset to default data or refetch from API
    setClients(defaultClients)
    toast({
      title: "Data refreshed",
      description: "Client data has been refreshed successfully.",
    })
  }, [toast])

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

  const handleAddClient = (values: z.infer<typeof addClientFormSchema>) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: values.name,
      clientId: values.identifier,
      status: "active",
      description: values.description,
      logo: values.logo || '/images/new-icon.png', // Default logo
    }
    setClients((prev) => [newClient, ...prev])
    setAddClientDialogOpen(false)
    addClientForm.reset()
    toast({
      title: "Client added",
      description: `${values.name} has been added to the client list.`,
    })
  }
  
  const handleDeleteSelected = () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id)
    const selectedCount = selectedIds.length
    
    if (selectedCount === 0) {
      toast({
        title: "No clients selected",
        description: "Please select clients to delete.",
        variant: "destructive"
      })
      return
    }

    setClients(prev => prev.filter(client => !selectedIds.includes(client.id)))
    setRowSelection({})
    toast({
      title: "Clients deleted",
      description: `${selectedCount} client(s) have been deleted.`,
      variant: "destructive"
    })
  }
  
  const handleDeleteRow = (clientId: string) => {
    const deletedClient = clients.find(client => client.id === clientId)
    setClients(prev => prev.filter(client => client.id !== clientId))
    toast({
      title: "Client deleted",
      description: `${deletedClient?.name || 'The client'} has been deleted.`,
      variant: "destructive"
    })
  }

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
  const isEmpty = clients.length === 0
  const hasSelectedRows = Object.keys(rowSelection).length > 0

  return (
    <ListLayout
      actions={
        <ClientActions 
          table={table}
          isAddClientDialogOpen={isAddClientDialogOpen}
          setAddClientDialogOpen={setAddClientDialogOpen}
          addClientForm={addClientForm}
          onAddClient={handleAddClient}
          onDeleteSelected={handleDeleteSelected}
          onRefreshData={handleRefreshData}
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