interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function PaginationIndex({ currentPage, totalPages }: PaginationProps) {
  const generatePagination = () => {
    const pagination = []

    if (totalPages <= 7) {
      // If total pages are less than or equal to 7, show all pages
      for (let i = 1; i <= totalPages; i += 1) {
        pagination.push(i)
      }
    } else {
      // Always include the first and last page
      pagination.push(1)

      if (currentPage > 4) {
        pagination.push('...')
      }

      // Add middle pages around the current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i += 1) {
        pagination.push(i)
      }

      if (currentPage < totalPages - 3) {
        pagination.push('...')
      }

      pagination.push(totalPages)
    }

    return pagination
  }

  const paginationItems = generatePagination()

  return (
    <div className="flex items-center justify-center space-x-2">
      {paginationItems.map((item, index) =>
        item === '...' ? (
          <span key={index} className="text-gray-500">
            ...
          </span>
        ) : (
          <span
            key={index}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
              item === currentPage ? 'bg-gray-200/30' : 'bg-white'
            }`}
          >
            {item}
          </span>
        ),
      )}
    </div>
  )
}
