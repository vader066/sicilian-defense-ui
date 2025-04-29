import { type Table } from '@tanstack/react-table'

import { PaginationIndex } from './page-index'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="w-full px-5 pb-1 pt-3 text-base">
      <div className="flex w-full flex-col items-end gap-4 space-x-6 md:w-auto md:flex-row md:items-center lg:space-x-8">
        <div className="flex w-full items-center justify-between">
          <button
            className="flex items-center justify-center gap-1 h-8 rounded-sm border border-gray-500/50 px-3"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <BsArrowLeft />
            <span>Previous</span>
          </button>
          <PaginationIndex
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
          />
          <button
            className="flex items-center gap-1 justify-center h-8 rounded-sm border border-gray-500/50 px-3"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>Next</span>
            <BsArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
