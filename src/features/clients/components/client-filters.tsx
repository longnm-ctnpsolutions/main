
"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react"

import type { Client } from "@/features/clients/types/client.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"

interface ClientFiltersProps {
  table: Table<Client>
}

export function ClientFilters({ table }: ClientFiltersProps) {
  return (
    <>
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
    </>
  )
}
