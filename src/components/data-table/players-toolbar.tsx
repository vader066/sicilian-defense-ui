import { type PLAYER } from '@/types/database/models'
import { type Table } from '@tanstack/react-table'
import { useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'

export function Toolbar({ table }: { table: Table<PLAYER> }) {
  const name = table.getState().columnFilters.find((f) => {
    f.id === 'name'
  })?.value

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    table.setColumnFilters((prev) => {
      return prev
        .filter((e) => e.id != 'name')
        .concat({
          id: 'name',
          value: e.target.value,
        })
    })
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
      <label className="flex items-center text-black/70 gap-2 rounded-md p-2 border border-black/50">
        <span>
          <BiSearch />
        </span>
        <input
          type="text"
          placeholder="Search Names"
          value={name as string}
          onChange={(e) => {
            handleFilter(e)
          }}
          className="focus:outline-none"
        />
      </label>
    </div>
  )
}
