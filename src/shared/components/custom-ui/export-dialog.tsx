"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { 
  FileSpreadsheet, 
  FileText, 
  Download,
  Settings,
  Loader2
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Separator } from "@/shared/components/ui/separator"
import { useToast } from "@/shared/hooks/use-toast"
import { 
  useUniversalExport, 
  ExportFormat, 
  ExportScope, 
  ExportOptions 
} from "@/hooks/use-export"

// Định nghĩa type CheckedState thủ công
type CheckedState = boolean | "indeterminate"

interface ExportDialogProps<T extends Record<string, any>> {
  table: Table<T>
  data?: T[]
  trigger?: React.ReactNode
}

export function ExportDialog<T extends Record<string, any>>({ 
  table, 
  data,
  trigger 
}: ExportDialogProps<T>) {
  const { exportData, isExporting, error } = useUniversalExport(table, data)
  const { toast } = useToast()
  
  const [open, setOpen] = React.useState(false)
  const [format, setFormat] = React.useState<ExportFormat>('excel')
  const [scope, setScope] = React.useState<ExportScope>('all')
  const [filename, setFilename] = React.useState('')
  const [includeHeaders, setIncludeHeaders] = React.useState(true)
  const [boldHeaders, setBoldHeaders] = React.useState(true)
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([])
  
  // PDF options
  const [pdfTitle, setPdfTitle] = React.useState('')
  const [pdfOrientation, setPdfOrientation] = React.useState<'portrait' | 'landscape'>('landscape')
  
  // Excel options  
  const [sheetName, setSheetName] = React.useState('Sheet1')
  const [addTimestamp, setAddTimestamp] = React.useState(true)

  // Get available columns
  const availableColumns = React.useMemo(() => {
    return table.getAllColumns()
      .filter(col => col.getCanHide() !== false)
      .map(col => ({
        id: col.id,
        label: typeof col.columnDef.header === 'string' 
          ? col.columnDef.header 
          : col.id
      }))
  }, [table])

  // Initialize selected columns
  React.useEffect(() => {
    if (selectedColumns.length === 0) {
      const visibleColumns = table.getAllColumns()
        .filter(col => col.getIsVisible() && col.getCanHide() !== false)
        .map(col => col.id)
      setSelectedColumns(visibleColumns)
    }
  }, [table, selectedColumns.length])

  // Handle column selection
  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  // Handle export
  const handleExport = async () => {
    try {
      const options: ExportOptions = {
        format,
        scope,
        filename: filename || undefined,
        includeHeaders,
        selectedColumns: selectedColumns.length > 0 ? selectedColumns : undefined,
        pdfOptions: format === 'pdf' ? {
          title: pdfTitle || undefined,
          orientation: pdfOrientation,
          pageSize: 'a4',
          headerStyle: {
            fontStyle: boldHeaders ? 'bold' : 'normal',
            lineWidth: 0.5
          }
        } : undefined,
        excelOptions: format === 'excel' ? {
          sheetName,
          addTimestamp,
          headerStyle: {
            font: { bold: boldHeaders },
            border: { bottom: { style: 'thin', color: { auto: 1 } } }
          }
        } : undefined
      }

      console.log('Export options:', options) // Debug log
      await exportData(options)
      
      toast({
        title: "Export thành công",
        description: `Dữ liệu đã được xuất dưới dạng ${format.toUpperCase()} thành công.`,
      })
      
      setOpen(false)
    } catch (err) {
      toast({
        title: "Export thất bại",
        description: error || "Đã xảy ra lỗi trong quá trình xuất dữ liệu.",
        variant: "destructive",
      })
    }
  }

  // Get selected row count
  const selectedRowsCount = table.getSelectedRowModel().rows.length
  const totalRowsCount = table.getCoreRowModel().rows.length
  const filteredRowsCount = table.getFilteredRowModel().rows.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="w-full sm:max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tùy chọn xuất dữ liệu
          </DialogTitle>
          <DialogDescription>
            Cấu hình cài đặt xuất dữ liệu và tải xuống dữ liệu của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Format Selection */}
          <div className="space-y-1">
            <Label htmlFor="format">Định dạng xuất</Label>
            <Select value={format} onValueChange={(value: ExportFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    CSV (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    PDF (.pdf)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    JSON (.json)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Selection */}
          <div className="space-y-1">
            <Label htmlFor="scope">Phạm vi dữ liệu</Label>
            <Select value={scope} onValueChange={(value: ExportScope) => setScope(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Tất cả dữ liệu ({totalRowsCount} hàng)
                </SelectItem>
                <SelectItem value="filtered">
                  Dữ liệu đã lọc ({filteredRowsCount} hàng)
                </SelectItem>
                <SelectItem value="selected" disabled={selectedRowsCount === 0}>
                  Các hàng đã chọn ({selectedRowsCount} hàng)
                </SelectItem>
                <SelectItem value="visible">
                  Dữ liệu hiển thị (trang hiện tại)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filename */}
          <div className="space-y-1">
            <Label htmlFor="filename">Tên file (tùy chọn)</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Để trống để tự động tạo tên"
            />
          </div>

          {/* Column Selection */}
          <div className="space-y-1">
            <Label>Các cột để xuất</Label>
            <div className="border rounded-lg p-2 max-h-24 overflow-y-auto">
              {availableColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2 py-0.5">
                  <Checkbox
                    id={`col-${column.id}`}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <Label 
                    htmlFor={`col-${column.id}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* General Options */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeaders"
                checked={includeHeaders}
                onCheckedChange={(checked: CheckedState) => {
                  if (checked !== 'indeterminate') {
                    setIncludeHeaders(checked)
                  }
                }}
              />
              <Label htmlFor="includeHeaders" className="text-sm">
                Bao gồm tiêu đề
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="boldHeaders"
                checked={boldHeaders}
                onCheckedChange={(checked: CheckedState) => {
                  if (checked !== 'indeterminate') {
                    setBoldHeaders(checked)
                  }
                }}
              />
              <Label htmlFor="boldHeaders" className="text-sm">
                In đậm tiêu đề
              </Label>
            </div>
          </div>

          {/* Format-specific options */}
          {format === 'excel' && (
            <>
              <Separator />
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Tùy chọn Excel</Label>
                <div className="space-y-1">
                  <div>
                    <Label htmlFor="sheetName" className="text-sm">Tên sheet</Label>
                    <Input
                      id="sheetName"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      className="mt-0.5"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="timestamp"
                      checked={addTimestamp}
                      onCheckedChange={(checked: CheckedState) => {
                        if (checked !== 'indeterminate') {
                          setAddTimestamp(checked)
                        }
                      }}
                    />
                    <Label htmlFor="timestamp" className="text-sm">
                      Thêm dấu thời gian vào tên file
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {format === 'pdf' && (
            <>
              <Separator />
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Tùy chọn PDF</Label>
                <div className="space-y-1">
                  <div>
                    <Label htmlFor="pdfTitle" className="text-sm">Tiêu đề tài liệu</Label>
                    <Input
                      id="pdfTitle"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      placeholder="Tiêu đề tài liệu (tùy chọn)"
                      className="mt-0.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orientation" className="text-sm">Hướng trang</Label>
                    <Select 
                      value={pdfOrientation} 
                      onValueChange={(value: 'portrait' | 'landscape') => setPdfOrientation(value)}
                    >
                      <SelectTrigger className="mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Dọc</SelectItem>
                        <SelectItem value="landscape">Ngang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || selectedColumns.length === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Xuất dữ liệu
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}