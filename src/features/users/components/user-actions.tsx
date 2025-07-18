
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
  RefreshCw
} from "lucide-react"

import type { User } from "@/features/users/types/user.types"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
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
import { UserFilters } from "./user-filters"

const addUserFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
})

interface UserActionsProps {
  table: Table<User>
  isAddUserSheetOpen: boolean
  setAddUserSheetOpen: (isOpen: boolean) => void
  addUserForm: UseFormReturn<z.infer<typeof addUserFormSchema>>
  onAddUser: (values: z.infer<typeof addUserFormSchema>) => void
  onDeleteSelected: () => void
}

export function UserActions({ 
  table,
  isAddUserSheetOpen,
  setAddUserSheetOpen,
  addUserForm,
  onAddUser,
  onDeleteSelected,
}: UserActionsProps) {
  
  const AddUserSheet = (
    <Sheet open={isAddUserSheetOpen} onOpenChange={setAddUserSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-full justify-start md:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a new user</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new user to the system.
          </SheetDescription>
        </SheetHeader>
        <Form {...addUserForm}>
          <form onSubmit={addUserForm.handleSubmit(onAddUser)} className="space-y-8 py-4">
            <FormField
              control={addUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </SheetClose>
              <Button type="submit">Add User</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );

  const DeleteDialog = (
     <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={table.getFilteredSelectedRowModel().rows.length === 0} className="w-full justify-start md:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected user(s).
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
            <span className="hidden lg:inline-flex">Export</span>
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
            <CardTitle>Users</CardTitle>
            <CardDescription>UI for admins to manage identities.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="User Search"
                  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                  }
                  className="pl-9 w-full md:w-[150px] lg:w-[250px]"
                />
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
                 <UserFilters table={table} />
            </div>

            <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>

            <div className="hidden md-lg:flex items-center gap-2">
               {ColumnChooser}
               {ExportMenu}
            </div>
            
            <div className="hidden lg:flex items-center gap-2">
                {DeleteDialog}
            </div>

            <div className="hidden xl:flex items-center gap-2">
                {AddUserSheet}
            </div>

            <div className="xl:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <div className="xl:hidden">
                        <DropdownMenuItem onSelect={e => e.preventDefault()}>{AddUserSheet}</DropdownMenuItem>
                    </div>
                    <div className="lg:hidden">
                         <DropdownMenuItem onSelect={e => e.preventDefault()}>{DeleteDialog}</DropdownMenuItem>
                    </div>
                   <div className="hidden md-lg:hidden">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <FileUp className="mr-2 h-4 w-4" />
                                <span>Export</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    <span>Export all to Excel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    <span>Export selected to Excel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Export all to PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Export selected to PDF</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                         <DropdownMenuItem onSelect={e => e.preventDefault()}>{ColumnChooser}</DropdownMenuItem>
                   </div>
                   <DropdownMenuSeparator className="sm:hidden" />
                   <div className="sm:hidden">
                        <UserFilters table={table} />
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

    