"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption, TableFooter } from "@/shared/components/ui/table"
import { Pencil, RefreshCcw, Trash } from "lucide-react"
import { useState } from "react";
import { TablePagination } from "@/shared/components/table/pagination"
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
  flexRender,
  type Table as defaultTable
} from "@tanstack/react-table"

import { permissions as defaultPermissions } from "@/features/clients/lib/data"
import type { Permission } from "@/features/clients/types/client.types"

export default function ClientDetailTabs() {

  const [isEditable, setIsEditable] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "permission", desc: false }
  ])  
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [permissions, setPermissions] = React.useState<Permission[]>(defaultPermissions)

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "permission",
      header: ({ column }) => {
        const sorted = column.getIsSorted(); // "asc" | "desc" | false
        const icon = sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↑";
        return (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => column.toggleSorting(sorted === "asc")}
          >
            Permission {icon}
          </div>
        );
      },
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "description",
      enableSorting: true,
      header: ({ column }) => {
        const sorted = column.getIsSorted(); // "asc" | "desc" | false
        const icon = sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↑";
        return (
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => column.toggleSorting(sorted === "asc")}
          >
            Description {icon}
          </div>
        );
      },
      cell: ({ getValue }) => getValue(),
    }
  ]

  // const handleDelete = (rowData: YourRowType) => {
  //   // Ví dụ:
  //   console.log("Delete row:", rowData)
  // }
   
  const table = useReactTable({
    data: permissions,
    columns: columns,
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

  return (
    <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
  {/* Card chứa TabsList (Header) */}
  <Card className="rounded-b-none border-b-0">
    <div className="px-2 pt-1 pb-2">
      <TabsList className="w-full justify-start bg-transparent">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>
    </div>
  </Card>

  {/* Card chứa nội dung, có thể scroll */}
  <Card className="flex flex-col flex-1 overflow-hidden rounded-t-none">
  <div className="flex flex-col flex-1 h-full px-4 pb-6 pt-0 min-h-0">
    <div className="flex-1 flex flex-col overflow-auto min-h-0">

    <TabsContent value="details">
            <div className="space-y-2 p-2">
            <div className="flex justify-end mt-4 gap-x-2">
              <Button size="sm" variant="outline">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Deactivate
              </Button>

              {isEditable ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditable(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#0f6cbd] text-white hover:bg-[#084c91]"
                    onClick={() => {
                      // TODO: handle save logic here
                      setIsEditable(false);
                    }}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-[#0f6cbd] text-white hover:bg-[#084c91]"
                  onClick={() => setIsEditable(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
              <p>Client ID</p>
              <Input
                disabled={true}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Client Name <span className="text-red-500">*</span></p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Identifier</p>
              <Input
                disabled={true}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Description</p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Homepage URL</p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />

              <div className="flex flex-col items-center justify-center w-full">
              <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${
                    isEditable
                      ? "cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100"
                      : "bg-muted opacity-60 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    disabled={!isEditable}
                  />
                </label>


                <div className="flex items-center mt-2">
                  <Button asChild variant="outline" size="sm" disabled={!isEditable}>
                  <label
                    htmlFor="dropzone-file"
                    className={!isEditable 
                      ? "pointer-events-none opacity-50" 
                      : "cursor-pointer"}
                  >
                    Select a file
                  </label>
                  </Button>
                  <span className="ml-2 text-sm text-muted-foreground">
                    or Drop file here
                  </span>
                </div>

              </div>
            </div>
          </TabsContent>

        <TabsContent value="permissions" className="flex-1 flex flex-col min-h-0">
          {/* Card: Add a Permission */}
          <Card className="rounded-[8px] border-[0px] pt-[20px] pb-[20px] px-[24px] space-y-4 shadow-[0_4px_20px_#0000000a] mb-[24px]">
            <div className="text-lg font-semibold">Add a Permission</div>

            <div className="flex w-full gap-4 items-end overflow-x-auto">
              <div className="flex flex-col flex-1 min-w-0 basis-1/3">
                <p className="text-sm mb-1">
                  Permission <span className="text-red-500">*</span>
                </p>
                <Input
                  className="bg-transparent w-full"
                  placeholder="Enter permission name"
                />
              </div>

              <div className="flex flex-col flex-1 min-w-0 basis-1/3">
                <p className="text-sm mb-1">Description</p>
                <Input
                  className="bg-transparent w-full"
                  placeholder="Enter description"
                />
              </div>

              <div className="flex flex-col flex-1 min-w-0 basis-1/3 items-end">
                <Button
                  size="sm"
                  className="w-[70px] bg-[#0f6cbd] text-white hover:bg-[#084c91]"
                >
                  Create
                </Button>
                <p className="text-sm mb-1 invisible">Create</p>
              </div>
            </div>
          </Card>

          {/* Card: List of Permissions */}
          <Card className="flex flex-col flex-1 rounded-[8px] border-[0px] pt-[20px] pb-[20px] px-[24px] space-y-4 shadow-[0_4px_20px_#0000000a] overflow-hidden min-h-[300px]">
            <div className="text-lg font-semibold">List of Permissions</div>

            <Card className="flex flex-col flex-1 min-h-[300px] overflow-hidden">
              <CardContent className="flex-1 p-0 min-h-0 flex flex-col">
                {/* Fixed Header */}
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                          {/* Thêm cột trống cho nút xóa */}
                          <TableHead className="w-[40px]"></TableHead>
                        </TableRow>
                      ))}
                    </TableHeader>
                  </Table>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1">
                  <Table>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                          {/* Nút delete */}
                          <TableCell className="w-[40px] text-right">
                            <Button
                              size="icon"
                              variant="outline"
                              className=""
                              // onClick={() => handleDelete(row.original)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <TablePagination table={table} />
          </Card>
        </TabsContent>
      </div>
    </div>
</Card>

</Tabs>

  );
}