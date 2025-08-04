"use client"

import * as React from "react"
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table"
import { MoreVertical, ArrowUpDown } from "lucide-react"

import type { Client } from "@/features/clients/types/client.types"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { cn } from "@/shared/lib/utils"
import { useResponsiveColumns, createColumnConfig } from "@/shared/hooks/use-responsive-columns"
import { useRouter } from 'next/navigation';

interface ClientTableProps {
  table: TableType<Client>;
  columns: ColumnDef<Client>[];
}

const CLIENT_TABLE_CONFIG = [
  createColumnConfig('select', 1, 1, 50),
  createColumnConfig('logo', 2, 1, 50),
  createColumnConfig('name', 3, 1, 120),
  createColumnConfig('description', 4, 3, 200, 1),
  createColumnConfig('status', 5, 4, 100),
  createColumnConfig('actions', 6, 2, 80),
]

export function ClientTable({ table, columns }: ClientTableProps) {
  const { 
    containerRef, 
    getColumnVisibilityClass, 
    getColumnWidthStyle,
    getDebugInfo 
  } = useResponsiveColumns(CLIENT_TABLE_CONFIG)

  const debugInfo = getDebugInfo
  const [headerWidths, setHeaderWidths] = React.useState<Record<string, number>>({})

  // Ref để lấy width của header cells
  const headerRefs = React.useRef<Record<string, HTMLElement>>({})

  // Effect để sync width giữa header và body
  React.useEffect(() => {
    const updateWidths = () => {
      const newWidths: Record<string, number> = {}
      Object.entries(headerRefs.current).forEach(([columnId, element]) => {
        if (element) {
          newWidths[columnId] = element.getBoundingClientRect().width
        }
      })
      setHeaderWidths(newWidths)
    }

    updateWidths()
    
    // ResizeObserver để detect khi container resize
    const resizeObserver = new ResizeObserver(updateWidths)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef])

  // Hàm để get exact width cho body cells
  const getExactColumnWidth = (columnId: string) => {
    if (headerWidths[columnId]) {
      return { width: `${headerWidths[columnId]}px`, minWidth: `${headerWidths[columnId]}px`, maxWidth: `${headerWidths[columnId]}px` }
    }
    return getColumnWidthStyle(columnId)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" ref={containerRef}>

      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const visibilityClass = getColumnVisibilityClass(header.id)
                  const widthStyle = getColumnWidthStyle(header.id)
                  
                  return (
                    <TableHead 
                      key={header.id} 
                      ref={(el) => {
                        if (el) {
                          headerRefs.current[header.id] = el
                        }
                      }}
                      className={cn("bg-background px-3", visibilityClass)}
                      style={widthStyle}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>

      {/* Body - Scrollable với exact width matching */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const visibilityClass = getColumnVisibilityClass(cell.column.id)
                    const exactWidthStyle = getExactColumnWidth(cell.column.id)
                    
                    return (
                      <TableCell 
                        key={cell.id} 
                        className={cn("px-3", visibilityClass)}
                        style={exactWidthStyle}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Alternative approach - Single table với sticky header
export function ClientTableSingleTable({ table, columns }: ClientTableProps) {
  const { 
    containerRef, 
    getColumnVisibilityClass, 
    getColumnWidthStyle,
    getDebugInfo 
  } = useResponsiveColumns(CLIENT_TABLE_CONFIG)

  const debugInfo = getDebugInfo

  return (
    <div className="flex flex-col h-full overflow-hidden" ref={containerRef}>

      {/* Single table với sticky header */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const visibilityClass = getColumnVisibilityClass(header.id)
                  const widthStyle = getColumnWidthStyle(header.id)
                  
                  return (
                    <TableHead 
                      key={header.id} 
                      className={cn("bg-background border-b sticky top-0 z-10", visibilityClass)}
                      style={widthStyle}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const visibilityClass = getColumnVisibilityClass(cell.column.id)
                    const widthStyle = getColumnWidthStyle(cell.column.id)
                    
                    return (
                      <TableCell 
                        key={cell.id} 
                        className={visibilityClass}
                        style={widthStyle}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Static columns method giữ nguyên
ClientTable.columns = (handleDeleteRow: (id: string) => void): ColumnDef<Client>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "logo",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.logo ? (
          <Image 
            src={row.original.logo} 
            alt={`${row.getValue("name")} logo`}
            width={32}
            height={32}
            className="rounded-md"
            data-ai-hint="logo"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-400 font-medium">
              {String(row.getValue("name")).charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold justify-start"
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold justify-start"
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm leading-relaxed">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === 'active';
      return (
        <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        )}>
           <span className={cn("mr-1.5 h-2 w-2 rounded-full", isActive ? "bg-green-500" : "bg-gray-400")} />
           <span className="capitalize">{status}</span>
        </div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original
        const router = useRouter();
        const handleDetailsClick = () => {
        router.push(`/en/clients/${client.id}`);
      };
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onSelect={handleDetailsClick}>Details</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this client.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteRow(client.id)} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]