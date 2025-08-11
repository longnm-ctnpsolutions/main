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
  Download,
  Loader2,
} from "lucide-react"

import type { Client } from "@/features/clients/types/client.types"
import { Input } from "@/shared/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { Button } from "@/shared/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/hooks/use-toast"

import { ClientFilters } from "./client-filters"
import AddClientDialog from '@/features/clients/components/add-client-dialog'
import ActionBar from '@/shared/components/custom-ui/actions-bar'
import { ActionItem } from '@/shared/components/custom-ui/hooks/use-responsive-actions'
import { ExportDialog } from "@/shared/components/custom-ui/export-dialog"
import { useUniversalExport } from "@/hooks/use-export"

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
  searchTerm: string
  setSearchTerm: (term: string) => void
  // Optional: External data for export if different from table data
  exportData?: Client[]
}

export const ClientActions = React.memo(function ClientActions({ 
  table,
  isLoading,
  isAddClientDialogOpen,
  isSidebarExpanded,
  setAddClientDialogOpen,
  addClientForm,
  onAddClient,
  onDeleteSelected,
  onRefreshData,
  searchTerm,
  setSearchTerm,
  exportData,
}: ClientActionsProps) {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = React.useState(false)
  
  // Universal export hook
  const { exportData: performExport, isExporting } = useUniversalExport(table, exportData)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Stable search handler
  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('🔍 ClientActions search input changed:', value);
    setSearchTerm(value);
  }, [setSearchTerm])

  // Quick export handlers
  const quickExportHandlers = React.useMemo(() => ({
    exportAllExcel: async () => {
      try {
        await performExport({
          format: 'excel',
          scope: 'all',
          filename: 'clients_all',
          excelOptions: {
            sheetName: 'Clients',
            addTimestamp: true
          }
        })
        toast({
          title: "Export successful",
          description: "All clients exported to Excel successfully.",
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "Failed to export clients to Excel.",
          variant: "destructive",
        })
      }
    },
    
    exportSelectedExcel: async () => {
      const selectedCount = table.getSelectedRowModel().rows.length
      if (selectedCount === 0) {
        toast({
          title: "No selection",
          description: "Please select at least one row to export.",
          variant: "destructive",
        })
        return
      }

      try {
        await performExport({
          format: 'excel',
          scope: 'selected',
          filename: 'clients_selected',
          excelOptions: {
            sheetName: 'Selected Clients',
            addTimestamp: true
          }
        })
        toast({
          title: "Export successful",
          description: `${selectedCount} selected clients exported to Excel successfully.`,
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "Failed to export selected clients to Excel.",
          variant: "destructive",
        })
      }
    },
    
    exportAllPdf: async () => {
      try {
        await performExport({
          format: 'pdf',
          scope: 'all',
          filename: 'clients_all',
          pdfOptions: {
            title: 'Client List',
            subtitle: 'All Clients Report',
            orientation: 'landscape'
          }
        })
        toast({
          title: "Export successful",
          description: "All clients exported to PDF successfully.",
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "Failed to export clients to PDF.",
          variant: "destructive",
        })
      }
    },
    
    exportSelectedPdf: async () => {
      const selectedCount = table.getSelectedRowModel().rows.length
      if (selectedCount === 0) {
        toast({
          title: "No selection",
          description: "Please select at least one row to export.",
          variant: "destructive",
        })
        return
      }

      try {
        await performExport({
          format: 'pdf',
          scope: 'selected',
          filename: 'clients_selected',
          pdfOptions: {
            title: 'Selected Clients',
            subtitle: `${selectedCount} Selected Clients Report`,
            orientation: 'landscape'
          }
        })
        toast({
          title: "Export successful",
          description: `${selectedCount} selected clients exported to PDF successfully.`,
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "Failed to export selected clients to PDF.",
          variant: "destructive",
        })
      }
    },
  }), [performExport, table, toast])

  // Column chooser content
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

  // Add client dialog component
  const addClientDialogComponent = React.useMemo(() => (
    <AddClientDialog
      isOpen={isAddClientDialogOpen}
      onOpenChange={setAddClientDialogOpen}
      form={addClientForm}
      onSubmit={onAddClient}
    />
  ), [isAddClientDialogOpen, setAddClientDialogOpen, addClientForm, onAddClient])

  // Export dialog component
  const exportDialogComponent = React.useMemo(() => (
    <ExportDialog 
      table={table} 
      data={exportData}
      trigger={
        <Button variant="ghost" size="icon" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileUp className="h-4 w-4" />
          )}
        </Button>
      }
    />
  ), [table, exportData, isExporting])

  // Actions array for ActionBar
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
      component: addClientDialogComponent
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
        minWidth: 1024,
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
        minWidth: 640,
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
        minWidth: 768,
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
      id: 'export-advanced',
      label: 'Export (Advanced)',
      icon: Download,
      type: 'custom',
      variant: 'ghost',
      priority: 3,
      hideAt: { 
        minWidth: 900,
        condition: ({ windowWidth }) => windowWidth < 900
      },
      component: exportDialogComponent
    },
    {
      id: 'export',
      label: 'Quick Export',
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
          onClick: quickExportHandlers.exportAllExcel,
          disabled: isExporting
        },
        {
          id: 'export-selected-excel',
          label: 'Export selected rows to Excel',
          icon: FileSpreadsheet,
          onClick: quickExportHandlers.exportSelectedExcel,
          disabled: isExporting || table.getFilteredSelectedRowModel().rows.length === 0
        },
        {
          id: 'export-all-pdf',
          label: 'Export all data to PDF',
          icon: FileText,
          onClick: quickExportHandlers.exportAllPdf,
          disabled: isExporting
        },
        {
          id: 'export-selected-pdf',
          label: 'Export selected rows to PDF',
          icon: FileText,
          onClick: quickExportHandlers.exportSelectedPdf,
          disabled: isExporting || table.getFilteredSelectedRowModel().rows.length === 0
        }
      ]
    }
  ], [
    addClientDialogComponent,
    exportDialogComponent,
    table,
    onDeleteSelected,
    onRefreshData,
    ColumnChooserContent,
    quickExportHandlers,
    isSidebarExpanded,
    isExporting
  ])

  // Loading state
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
              <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value=""
                  className="pl-9 w-full md:w-[150px] lg:w-[250px]"
                  disabled
                />
              </div>
              
              <div className="items-center gap-2 hidden sm:flex">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
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
            {/* Search Input */}
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 w-full md:w-[150px] lg:w-[250px]"
              />
            </div>
            
            {/* Filters */}
            <div className="items-center gap-2 hidden sm:flex">
              <ClientFilters table={table} />
            </div>

            {/* Action Bar */}
            <ActionBar 
              actions={actions}
              isSidebarExpanded={isSidebarExpanded}
              enableDropdown={true}
              dropdownThreshold={1}
              spacing="md"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
})

// Display name for debugging
ClientActions.displayName = 'ClientActions'