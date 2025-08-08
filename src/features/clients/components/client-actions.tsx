"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { 
  Trash2, 
  UserPlus, 
  Columns, 
  FileUp, 
  FileSpreadsheet, 
  FileText, 
  Search,
  RefreshCw,
} from "lucide-react"

import type { Client } from "@/features/clients/types/client.types"
import { Input } from "@/shared/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/shared/components/ui/dropdown-menu"

import { ClientFilters } from "./client-filters"
import AddClientDialog from '@/features/clients/components/add-client-dialog'
import ActionBar from '@/shared/components/custom-ui/actions-bar'
import { ActionItem } from '@/shared/components/custom-ui/hooks/use-responsive-actions'

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const addClientFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a client name." }),
  identifier: z.string().min(1, { message: "Please enter a client identifier." }),
  description: z.string(),
  homepageurl: z.string(),
  logo: z.any().optional(),
})

interface ClientActionsProps {
  table: Table<Client>
  isLoading?: boolean;
  isAddClientDialogOpen: boolean
  isSidebarExpanded: boolean
  setAddClientDialogOpen: (isOpen: boolean) => void
  addClientForm: UseFormReturn<z.infer<typeof addClientFormSchema>>
  onAddClient: (values: z.infer<typeof addClientFormSchema>) => void
  onDeleteSelected: () => void
  onRefreshData?: () => void
  // OData search props
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function ClientActions({ 
  table,
  isLoading,
  isAddClientDialogOpen,
  isSidebarExpanded,
  setAddClientDialogOpen,
  addClientForm,
  onAddClient,
  onDeleteSelected,
  onRefreshData,
  // OData search props
  searchTerm,
  setSearchTerm,
}: ClientActionsProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  // Local state for input value to maintain focus
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm)
  
  // Debounce the search term
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500) // 500ms delay
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync local search term with prop when it changes externally
  React.useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Update parent search term only when debounced value changes
  React.useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setSearchTerm(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, searchTerm, setSearchTerm])

  // Memoize ColumnChooserContent to prevent unnecessary re-renders
  const ColumnChooserContent = React.useMemo(() => (
    <>
      <DropdownMenuLabel className="font-bold">Column Chooser</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <DropdownMenuItem 
            key={column.id} 
            onSelect={(e) => e.preventDefault()} 
            className="gap-2"
          >
            <Checkbox
              id={`col-toggle-${column.id}`}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            />
            <Label 
              htmlFor={`col-toggle-${column.id}`} 
              className="capitalize cursor-pointer w-full"
            >
              {column.id}
            </Label>
          </DropdownMenuItem>
        ))}
    </>
  ), [table])

  // Memoize actions to prevent unnecessary re-renders
  const actions: ActionItem[] = React.useMemo(() => [
    {
      id: 'add-client',
      label: 'Add Client',
      icon: UserPlus,
      type: 'custom',
      priority: 5, 
      hideAt: { 
        minWidth: 1150,
        condition: ({ isSidebarExpanded, windowWidth }) => {
          const threshold = isSidebarExpanded ? 1345 : 1150
          return windowWidth < threshold
        }
      },
      component: (
        <AddClientDialog
          isOpen={isAddClientDialogOpen}
          onOpenChange={setAddClientDialogOpen}
          form={addClientForm}
          onSubmit={onAddClient}
        />
      )
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      type: 'dialog',
      variant: 'destructive',
      disabled: table.getFilteredSelectedRowModel().rows.length === 0,
      onClick: onDeleteSelected,
      priority: 4,
      hideAt: { 
        minWidth: 1024, // lg breakpoint
        condition: ({ windowWidth }) => windowWidth < 1024
      }
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      type: 'button',
      variant: 'ghost',
      size: 'icon',
      onClick: onRefreshData,
      priority: 1,
      hideAt: { 
        minWidth: 640, // sm breakpoint
        condition: ({ windowWidth }) => windowWidth < 640
      }
    },
    {
      id: 'column-chooser',
      label: 'Column Chooser',
      icon: Columns,
      type: 'dropdown',
      variant: 'ghost',
      size: 'icon',
      priority: 2,
      hideAt: { 
        minWidth: 768, // md breakpoint
        condition: ({ windowWidth }) => windowWidth < 768
      },
      children: [
        {
          id: 'column-chooser-content',
          label: 'Column Chooser',
          component: ColumnChooserContent
        }
      ]
    },
    {
      id: 'export',
      label: 'Export',
      icon: FileUp,
      type: 'dropdown',
      variant: 'ghost',
      priority: 3,
      hideAt: { 
        minWidth: 960,
        condition: ({ windowWidth }) => windowWidth < 960
      },
      children: [
        {
          id: 'export-all-excel',
          label: 'Export all data to Excel',
          icon: FileSpreadsheet,
          onClick: () => console.log('Export all to Excel')
        },
        {
          id: 'export-selected-excel',
          label: 'Export selected rows to Excel',
          icon: FileSpreadsheet,
          onClick: () => console.log('Export selected to Excel')
        },
        {
          id: 'export-all-pdf',
          label: 'Export all data to PDF',
          icon: FileText,
          onClick: () => console.log('Export all to PDF')
        },
        {
          id: 'export-selected-pdf',
          label: 'Export selected rows to PDF',
          icon: FileText,
          onClick: () => console.log('Export selected to PDF')
        }
      ]
    }
  ], [
    table, 
    onRefreshData, 
    ColumnChooserContent, 
    onDeleteSelected, 
    isAddClientDialogOpen, 
    setAddClientDialogOpen, 
    addClientForm, 
    onAddClient, 
    isSidebarExpanded
  ])

  // Handle input change with local state
  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value)
  }, [])

  // Show loading state during hydration to prevent flash
  if (!isMounted || isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage your application clients.</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search Input - Loading State */}
              <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Client Search"
                  value=""
                  className="pl-9 w-full md:w-[150px] lg:w-[250px]"
                  disabled
                />
              </div>
              
              {/* Filters - Hidden on mobile */}
              <div className="items-center gap-2 hidden sm:flex">
                <ClientFilters table={table} />
              </div>

              {/* Loading placeholder */}
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Manage your application clients.</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {/* OData Search Input with local state */}
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pl-9 w-full md:w-[150px] lg:w-[250px]"
              />
              {/* Loading indicator when searching */}
              {localSearchTerm !== searchTerm && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Filters - Hidden on mobile */}
            <div className="items-center gap-2 hidden sm:flex">
              <ClientFilters table={table} />
            </div>

            {/* Single Action Bar - Responsive */}
            <ActionBar 
              actions={actions}
              isSidebarExpanded={isSidebarExpanded}
              enableDropdown={true}
              dropdownThreshold={1} // Show dropdown when at least 1 action is hidden
              spacing="md"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}