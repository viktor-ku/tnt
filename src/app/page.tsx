'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Entry, IEntry } from '@/entity/entry'
import { ChangeEventHandler, useRef, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import CreateTimerScreen from "@/components/CreateTimerScreen";

const fixedEntries = [
  Entry.with({ task: "XML parsing & bundling", rate: 10 }),
]

const col = createColumnHelper<IEntry>()

const columns = [
  col.accessor('task', {
    cell: data => (
      <div className="flex items-center">
        <div className="h-10 w-10 flex-shrink-0">
          <button className="h-10 w-10">
            <PlayIcon className="w-full h-full fill-indigo-600" />
          </button>
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">{data.getValue()}</div>
          <div className="text-gray-500">{data.row.original.clientId ? `${data.row.original.clientId}` : 'no client'}</div>
        </div>
      </div>
    ),
  })
]

export default function Home() {

  // TODO:
  // have normalized objects in the store
  // select & transform them for the table

  const [entries, setEntries] = useState(() => fixedEntries)

  const table = useReactTable({
    data: entries,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const originalInputRef = useRef<HTMLInputElement | null>(null)

  const [open, setOpen] = useState(false)

  const handleDescChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!open) {
      setOpen(true)
    }
  }

  return (
    <div>

      <CreateTimerScreen
        open={open}
        clients={[]}
        currencies={[]}
        onClose={() => setOpen(false)}
        onSubmit={() => { }}
        originalInputRef={originalInputRef}
      />

      <div className="bg-indigo-500 w-full h-64 -mb-48"></div>

      <div className="mx-auto w-2/3">
        <p className="lowercase font-normal text-5xl text-white select-none mb-4">Tasks!</p>

        <div className="bg-white shadow-lg mb-4 flow-root mt-2">
          <input
            type="text"
            className="w-full p-4 text-lg focus:border-slate-700 z-50 relative"
            placeholder="I am working on..."
            tabIndex={0}
            ref={originalInputRef}
            onClick={() => setOpen(true)}
            onChange={handleDescChange}
          />
        </div>

        <div className="bg-white shadow-lg">

          <div className="px-6 lg:px-8 pb-2">
            <div className="mt-8">
              <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      {table.getHeaderGroups().map(hgroup => (
                        <tr key={hgroup.id}>
                          {hgroup.headers.map(header => (
                            <th
                              scope="col"
                              key={header.id}
                              colSpan={header.colSpan}
                              className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-0 uppercase"
                            >
                              {
                                header.isPlaceholder
                                  ? null
                                  : flexRender(header.column.columnDef.header, header.getContext())
                              }
                              {
                                header.column.getCanResize()
                                  ? <div
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                                  />
                                  : null
                              }
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">

                      {table.getRowModel().rows.map(row => {
                        return (
                          <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                              return (
                                <td
                                  className="whitespace-nowrap py-4 pl-6 pr-3 text-sm sm:pl-0"
                                  key={cell.id}
                                  style={{ width: cell.column.getSize() }}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
