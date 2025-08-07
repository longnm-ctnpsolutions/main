
"use client"

import * as React from "react"
import Image from "next/image"
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table"
import { MoreVertical, ArrowUpDown, Loader2 } from "lucide-react"

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
} from "@/shared/components/ui/alert-dialog"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { cn } from "@/shared/lib/utils"
import { useRouter } from 'next/navigation'

interface ClientTableProps {
  table: TableType<Client>;
  columns: ColumnDef<Client>[];
  isLoading: boolean;
}

const TableSkeleton = ({ columns }: { columns: ColumnDef<Client>[] }) => {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            {columns.map((column) => (
              <TableCell key={column.id || index}>
                <Skeleton className="h-5 w-full rounded" />
              </TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
};


export function EnhancedClientTable({ table, columns, isLoading }: ClientTableProps) {
  
  return (
    <div className="overflow-auto h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={cn({
                    'hidden lg:table-cell': header.id === 'description',
                    'hidden md:table-cell': header.id === 'status'
                  })}>
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
           {isLoading ? (
            <TableSkeleton columns={columns} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn({
                     'hidden lg:table-cell': cell.column.id === 'description',
                     'hidden md:table-cell': cell.column.id === 'status'
                  })}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
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
  )
}

// Updated columns definition with better action handling
EnhancedClientTable.columns = (handleDeleteRow: (id: string) => void): ColumnDef<Client>[] => [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold justify-start"
      >
        Client Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium truncate">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold justify-start"
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm leading-relaxed truncate">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusValue = row.getValue("status") 
      const status = (statusValue === 1 || statusValue === "1") ? 'active' : 'inactive'
      const isActive = status === 'active'
      
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
      const router = useRouter()
      
      const handleDetailsClick = () => {
        router.push(`/en/clients/${client.id}`)
      }
      
      const handleDeleteClick = async () => {
        await handleDeleteRow(client.id)
      }
      
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
              <DropdownMenuItem onSelect={handleDetailsClick}>
                Details
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()} 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                  >
                    Delete
                  </DropdownMenuItem>
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
                    <AlertDialogAction 
                      onClick={handleDeleteClick}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Continue
                    </AlertDialogAction>
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
