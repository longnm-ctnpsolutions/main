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
import { ClientTable } from "./client-table"
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

export function ClientDashboard() {
  const { toast } = useToast()
  const { state: sidebarState } = useSidebar()
  const [clients, setClients] = React.useState<Client[]>(defaultClients)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddClientDialogOpen, setAddClientDialogOpen] = React.useState(false)

  const isSidebarExpanded = sidebarState === 'expanded';

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
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    setClients(prev => prev.filter(client => !selectedIds.includes(client.id)));
    setRowSelection({});
    toast({
      title: "Clients deleted",
      description: `${selectedIds.length} client(s) have been deleted.`,
      variant: "destructive"
    })
  }
  
  const handleDeleteRow = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
     toast({
      title: "Client deleted",
      description: `The client has been deleted.`,
      variant: "destructive"
    })
  }

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
  const isEmpty = clients.length === 0

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