
"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Search, RefreshCw } from "lucide-react"

import type { User } from "@/features/users/types/user.types"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"

interface UserFiltersProps {
  table: Table<User>
}

export function UserFilters({ table }: UserFiltersProps) {
  return (
    <>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="User Search"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="pl-9"
        />
      </div>
      <Select 
        defaultValue="all"
        onValueChange={(value) => {
            if (value === 'all') {
                table.getColumn("status")?.setFilterValue(undefined);
            } else {
                table.getColumn("status")?.setFilterValue(value);
            }
        }}
      >
        <SelectTrigger className="w-auto gap-1 border-0 bg-transparent hover:bg-accent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
    </>
  )
}
