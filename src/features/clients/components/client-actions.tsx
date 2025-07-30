
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
  ChevronDown,
  MoreVertical,
  Search,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { cn } from "@/shared/lib/utils"

import type { Client } from "@/features/clients/types/client.types"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/shared/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { ClientFilters } from "./client-filters"
import AddClientDialog from '@/features/clients/components/add-client-dialog'

const addClientFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a client name." }),
  identifier: z.string().min(1, { message: "Please enter a client identifier." }),
  description: z.string(),
  homepageurl: z.string(),
  logo: z.any().optional(),
})

interface ClientActionsProps {
  table: Table<Client>
  isAddClientDialogOpen: boolean
  isSidebarExpanded: boolean
  setAddClientDialogOpen: (isOpen: boolean) => void
  addClientForm: UseFormReturn<z.infer<typeof addClientFormSchema>>
  onAddClient: (values: z.infer<typeof addClientFormSchema>) => void
  onDeleteSelected: () => void
}

export function ClientActions({ 
  table,
  isAddClientDialogOpen,
  isSidebarExpanded,
  setAddClientDialogOpen,
  addClientForm,
  onAddClient,
  onDeleteSelected,
}: ClientActionsProps) {

  const DeleteDialog = (
     <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected client(s).
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteSelected} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )

  const ExportMenu = (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10">
            <FileUp className="h-4 w-4" />
            <span>Export</span>
            <ChevronDown className="ml-2 h-4 w-4 hidden lg:inline-flex" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export all data to Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export selected rows to Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export all data to PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export selected rows to PDF</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  const ColumnChooser = (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
            <Columns className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-bold">Column Chooser</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
                return (
                <DropdownMenuItem key={column.id} onSelect={(e) => e.preventDefault()} className="gap-2">
                    <Checkbox
                    id={`col-toggle-${column.id}-lg`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                    }
                    />
                    <Label htmlFor={`col-toggle-${column.id}-lg`} className="capitalize cursor-pointer w-full">{column.id}</Label>
                </DropdownMenuItem>
                )
            })}
        </DropdownMenuContent>
    </DropdownMenu>
  );
  
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
                  placeholder="Client Search"
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="pl-9 w-full md:w-[150px] lg:w-[250px]"
                />
            </div>
            
            <div className="items-center gap-2 hidden sm:flex">
                 <ClientFilters table={table} />
            </div>

            <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            
            {/* Desktop Actions */}
            <div className={cn("hidden md:flex items-center gap-2")}>
                <div className={cn(isSidebarExpanded && "hidden", "xl:flex")}> 
                  <AddClientDialog
                    isOpen={isAddClientDialogOpen}
                    onOpenChange={setAddClientDialogOpen}
                    form={addClientForm}
                    onSubmit={onAddClient}
                  />
        </div>
                <div className={cn(isSidebarExpanded && "hidden", "lg:flex")}>{DeleteDialog}</div>
                <div className={cn(isSidebarExpanded && "hidden", "md-lg:flex")}>
                    {ExportMenu}
                    {ColumnChooser}
                </div>
            </div>

            {/* Mobile/Tablet Actions */}
            <div className={cn("flex md:hidden")}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setAddClientDialogOpen(true)}>
                           <UserPlus className="mr-2 h-4 w-4" /> Add Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <div onClick={(e) => {
                            e.stopPropagation();
                            const trigger = document.getElementById('delete-dialog-trigger-client-mobile');
                            if(trigger) trigger.click();
                          }}>
                           <AlertDialog>
                              <AlertDialogTrigger asChild id="delete-dialog-trigger-client-mobile">
                                  <div className="flex items-center">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the selected client(s).
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={onDeleteSelected} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <FileUp className="mr-2 h-4 w-4" /> Export
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                <span>Export all data to Excel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                <span>Export selected rows to Excel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Export all data to PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Export selected rows to PDF</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Columns className="mr-2 h-4 w-4" />
                                <span>Column Chooser</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                    <DropdownMenuItem key={column.id} onSelect={(e) => e.preventDefault()} className="gap-2">
                                        <Checkbox
                                        id={`col-toggle-${column.id}-sm`}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        />
                                        <Label htmlFor={`col-toggle-${column.id}-sm`} className="capitalize cursor-pointer w-full">{column.id}</Label>
                                    </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <div className="flex sm:hidden">
                            <DropdownMenuSeparator />
                            <ClientFilters table={table} />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

    