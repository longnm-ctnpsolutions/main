"use client"

import { useMemo } from "react"
import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { Client } from "@/features/clients/types/client.types"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

interface ClientPaginationProps {
  table: Table<Client>;
  pageSizeOptions?: number[];
  totalCount?: number; // Add totalCount for OData server-side pagination
}

export function ClientPagination({ 
  table, 
  pageSizeOptions = [5, 10, 20],
  totalCount 
}: ClientPaginationProps) {
  const currentPage = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  
  // Use totalCount from OData instead of client-side table data
  const actualTotalCount = totalCount ?? table.getFilteredRowModel().rows.length
  const totalPages = Math.ceil(actualTotalCount / pageSize)
  
  // Calculate correct page info for server-side pagination
  const startItem = actualTotalCount === 0 ? 0 : currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, actualTotalCount)

  // Memoize page numbers with correct totalPages
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, 3, -1, totalPages - 1)
      } else if (currentPage >= totalPages - 3) {
        pages.push(0, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1)
      } else {
        pages.push(0, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages - 1)
      }
    }

    return pages
  }, [currentPage, totalPages])

  // Check if we can navigate (based on server-side pagination)
  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < totalPages - 1

  if (totalPages === 0) {
    return (
      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-2 text-sm">
      {/* Page Size Options - Left Side */}
      <div className="flex items-center gap-4 text-muted-foreground">
        {pageSizeOptions.map((pageSizeOption) => (
          <Button
            key={pageSizeOption}
            variant={pageSize === pageSizeOption ? "default" : "ghost"}
            onClick={() => {
              // Use custom setPageSize for server-side pagination
              if ('setPageSize' in table && typeof table.setPageSize === 'function') {
                (table as any).setPageSize(pageSizeOption)
              } else {
                table.setPageSize(pageSizeOption)
              }
            }}
            className={cn(
              "h-8 w-8 p-0",
              pageSize === pageSizeOption ? "rounded-full" : ""
            )}
            aria-label={`Show ${pageSizeOption} items per page`}
          >
            {pageSizeOption}
          </Button>
        ))}
      </div>

      {/* Pagination Info and Controls - Right Side */}
      <div className="flex items-center gap-4">
        {/* Page Info */}
        <div className="text-muted-foreground hidden sm:block">
          {actualTotalCount === 0 ? (
            "No items"
          ) : (
            <>Page {currentPage + 1} of {totalPages} ({actualTotalCount} items)</>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // Use custom setPageIndex for server-side pagination
              if ('setPageIndex' in table && typeof table.setPageIndex === 'function') {
                (table as any).setPageIndex(currentPage - 1)
              } else {
                table.previousPage()
              }
            }}
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((pageIndex, index) => {
            if (pageIndex === -1) {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            return (
              <Button
                key={pageIndex}
                variant={currentPage === pageIndex ? "default" : "ghost"}
                className={cn(
                  "h-8 w-8 p-0",
                  currentPage === pageIndex ? "rounded-full" : ""
                )}
                onClick={() => {
                  // Use custom setPageIndex for server-side pagination
                  if ('setPageIndex' in table && typeof table.setPageIndex === 'function') {
                    (table as any).setPageIndex(pageIndex)
                  } else {
                    table.setPageIndex(pageIndex)
                  }
                }}
                aria-label={`Go to page ${pageIndex + 1}`}
              >
                {pageIndex + 1}
              </Button>
            )
          })}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // Use custom setPageIndex for server-side pagination
              if ('setPageIndex' in table && typeof table.setPageIndex === 'function') {
                (table as any).setPageIndex(currentPage + 1)
              } else {
                table.nextPage()
              }
            }}
            disabled={!canNextPage}
            aria-label="Go to next page"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}