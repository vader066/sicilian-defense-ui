import * as React from 'react'
import {
  type ColumnDef,
  type Table as TableType,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { DataTablePagination } from './data-table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  DataTableToolbar?: React.ComponentType<{
    table: TableType<TData>
    title?: string
    documentId?: string
    isSynced?: boolean
  }>
  DataTableHeader?: React.ComponentType<{
    table: TableType<TData>
  }>
  title?: string
  onTableDataClick?: (data: TData) => void
  isLoading: boolean
  TclassName?: string
  TheadClassName?: string
  TcellClassName?: string
  TbodyClassName?: string
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  DataTableToolbar,
  DataTableHeader,
  title,
  onTableDataClick,
  isLoading = true,
  TclassName, // classname to style DataTable parent comp
  TheadClassName, // classname to style TableHead child comp
  TcellClassName, // classname to style TableCell child comp
  TbodyClassName, // classname to style TableBody child comp
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="flex h-full w-full flex-col">
      {DataTableToolbar && (
        <div className="flex items-center">
          <DataTableToolbar title={title || ''} table={table} />
        </div>
      )}
      {DataTableHeader && <DataTableHeader table={table} />}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border bg-white dark:bg-transparent',
          TclassName,
        )}
      >
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap bg-gray-50 text-center',
                        TheadClassName,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={TbodyClassName}>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={cn('h-24 py-6 text-center', TcellClassName)}
                >
                  <Spinner size="medium" />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={`${cell.id}_${index}`}
                          onClick={() => {
                            const clickedCell = cell.column.columnDef
                            const cellHasAccessorKey =
                              'accessorKey' in clickedCell
                            if (
                              cellHasAccessorKey &&
                              (clickedCell?.accessorKey as string)
                                ?.toLowerCase()
                                .includes('action')
                            ) {
                              return
                            }
                            onTableDataClick?.(cell.row.original)
                          }}
                          className={`${
                            onTableDataClick &&
                            typeof onTableDataClick === 'function'
                              ? 'cursor-pointer'
                              : ''
                          } ${cn('py-6 text-center', TcellClassName)}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
              </>
            )}
          </TableBody>
        </Table>
        <div className="mb-2 w-full">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
