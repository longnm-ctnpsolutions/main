import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Columns, Eye, EyeOff, RotateCcw } from "lucide-react"

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { useColumnVisibility } from "@/hooks/use-visible-column"

interface ColumnChooserProps<T> {
  /**
   * React Table instance
   */
  table: Table<T>
  
  /**
   * Unique storage key for this table
   */
  storageKey: string
  
  /**
   * Default column visibility
   */
  defaultVisibility?: Record<string, boolean>
  
  /**
   * Columns that cannot be hidden
   */
  lockedColumns?: string[]
  
  /**
   * Custom trigger button
   */
  trigger?: React.ReactNode
  
  /**
   * Show quick action buttons (show all, hide all, reset)
   */
  showQuickActions?: boolean
  
  /**
   * Custom column label formatter
   */
  formatColumnLabel?: (columnId: string) => string
}

/**
 * Column chooser component with dropdown UI
 */
export function ColumnChooser<T>({
  table,
  storageKey,
  defaultVisibility = {},
  lockedColumns = [],
  trigger,
  showQuickActions = true,
  formatColumnLabel
}: ColumnChooserProps<T>) {
  
  const {
    columnVisibility,
    setColumnVisibility,
    showAllColumns,
    hideAllColumns,
    resetToDefault,
    visibleColumnsCount,
    hiddenColumnsCount,
    getColumnVisibilityItems
  } = useColumnVisibility<T>({
    storageKey,
    defaultVisibility,
    lockedColumns
  })
  
  // Update table visibility state when hook state changes
  React.useEffect(() => {
    table.setColumnVisibility(columnVisibility)
  }, [table, columnVisibility])
  
  // Get column items for rendering
  const columnItems = React.useMemo(() => 
    getColumnVisibilityItems(table), 
    [table, getColumnVisibilityItems]
  )
  
  // Format column label
  const getColumnLabel = React.useCallback((item: ReturnType<typeof getColumnVisibilityItems>[0]) => {
    if (formatColumnLabel) {
      return formatColumnLabel(item.id)
    }
    
    // Default formatting: capitalize and replace underscores/dashes with spaces
    return item.label
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }, [formatColumnLabel])
  
  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="relative">
      <Columns className="h-4 w-4" />
      {hiddenColumnsCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
        >
          {hiddenColumnsCount}
        </Badge>
      )}
    </Button>
  )
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-bold">Column Chooser</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{visibleColumnsCount} visible</span>
            {hiddenColumnsCount > 0 && (
              <>
                <span>•</span>
                <span>{hiddenColumnsCount} hidden</span>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        {showQuickActions && (
          <>
            <div className="flex gap-1 p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs flex-1"
                onClick={() => showAllColumns(table)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Show All
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs flex-1"
                onClick={() => hideAllColumns(table)}
                disabled={lockedColumns.length === columnItems.length}
              >
                <EyeOff className="h-3 w-3 mr-1" />
                Hide All
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={resetToDefault}
                title="Reset to default"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Column List */}
        <div className="max-h-60 overflow-y-auto">
          {columnItems.map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onSelect={(e) => e.preventDefault()}
              className="gap-2 py-2"
            >
              <Checkbox
                id={`col-toggle-${item.id}`}
                checked={item.isVisible}
                disabled={item.isLocked}
                onCheckedChange={() => item.toggle()}
                className="flex-shrink-0"
              />
              
              <Label 
                htmlFor={`col-toggle-${item.id}`} 
                className={`cursor-pointer flex-1 text-sm ${
                  item.isLocked ? 'text-muted-foreground' : ''
                }`}
              >
                {getColumnLabel(item)}
                {item.isLocked && (
                  <span className="ml-1 text-xs text-muted-foreground">(locked)</span>
                )}
              </Label>
            </DropdownMenuItem>
          ))}
        </div>
        
        {columnItems.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No hideable columns available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}