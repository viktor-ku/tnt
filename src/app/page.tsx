'use client';

import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Entry, IEntry } from '@/entity/entry'
import { useMemo, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";

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
          <div className="text-gray-500">EUR {data.row.original.clientId}/h</div>
        </div>
      </div>
    ),
  })
]

export default function Home() {
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

  return (
    <div>

      <div className="bg-indigo-500 w-full h-48 -mb-24"></div>

      <div className="mx-auto w-2/3">
        <p className="lowercase font-normal text-5xl text-white select-none">Tasks!</p>
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
                      {
                        // <tr>
                        //   <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        //     Name
                        //   </th>
                        //   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        //     Title
                        //   </th>
                        //   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        //     Status
                        //   </th>
                        //   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        //     Role
                        //   </th>
                        //   <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-0">
                        //     <span className="sr-only">Edit</span>
                        //   </th>
                        // </tr>
                      }
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


                      {/*
                      {people.map((person) => (
                        <tr key={person.email}>
                          <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{person.name}</div>
                                <div className="text-gray-500">{person.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{person.title}</div>
                            <div className="text-gray-500">{person.department}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                              Edit<span className="sr-only">, {person.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                      */}

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
