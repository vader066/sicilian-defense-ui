import { type PLAYER } from '@/types/database/models'
import { type Table } from '@tanstack/react-table'
import { useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'

export function Toolbar({ table }: { table: Table<PLAYER> }) {
  const searchValue = table.getState().globalFilter || ''

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    table.setGlobalFilter(e.target.value)
  }

  useEffect(() => {
    table.setSorting([
      {
        id: 'rating',
        desc: true,
      },
    ])
  }, [])

  return (
    <div>
      <label className="flex items-center text-black/70 gap-2 rounded-md mb-5 p-2 border border-black/50">
        <span>
          <BiSearch />
        </span>
        <input
          type="text"
          placeholder="Search Names"
          value={searchValue}
          onChange={(e) => {
            handleFilter(e)
          }}
          className="focus:outline-none"
        />
      </label>
    </div>
  )
}
