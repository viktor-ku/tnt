'use client';

import { useState, ChangeEventHandler, FormEventHandler, useEffect } from "react"
import { ITask, Task } from "@/entity/task";
import { Record } from "@/entity/record";
import { isOdd } from "@/utilities/isOdd";
import Link from "next/link";
import { Dialog, Combobox } from '@headlessui/react'
import { v4 as uuid } from 'uuid'

interface Client {
  id: string
  name: string
  address?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [newTask, setNewTask] = useState({ desc: '' })
  const [isOpen, setIsOpen] = useState(true)

  const [clients, setClients] = useState<Client[]>(() => [
    { id: uuid(), name: 'One Two OU' },
    { id: uuid(), name: 'Two Three Ou' },
    { id: uuid(), name: 'Three Four Ou' },
    { id: uuid(), name: 'Four Five Ou' },
    { id: uuid(), name: 'Five Six Ou' },
  ]);

  const handleTaskCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTasks(tasks => ([...tasks, Task.with({ title: newTask.desc, createdAt: Date.now() })]))
    setNewTask({ desc: '' })
  }

  const handleTaskDescChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value
    setNewTask({ desc: val })
  }

  useEffect(() => {
    const id = setInterval(() => {
      setTasks(tasks => {
        return tasks.map(task => isOdd(task.timeline.length) ? ({ ...task }) : task)
      })
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [])

  const handleStartTask = (id: string) => {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            timeline: [...task.timeline, Record.at(Date.now())]
          }
        }
        return task
      })
    })
  }

  const handleStopTask = (id: string) => {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            timeline: [...task.timeline, Record.at(Date.now())]
          }
        }
        return task
      })
    })
  }

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientQuery, setClientQuery] = useState('')
  const [clientPickMode, setClientPickMode] = useState<'createpick' | 'pick' | 'none'>('none')
  const [clientForm, setClientForm] = useState({ address: '' })

  const clientResults = clientQuery
    ? clients.filter((client) => client.name.toLowerCase().includes(clientQuery.toLowerCase()))
    : clients

  function handleComoboxSelect(val: Client | 'new') {
    if (val === 'new') {
      setSelectedClient({ id: uuid(), name: clientQuery })
      setClientPickMode('createpick')
    } else {
      setSelectedClient(val)
      setClientPickMode('pick')
    }
  }

  function pickClient() {
    if (clientPickMode === 'createpick') {
      if (!selectedClient) {
        throw new Error('did not find the selected client in a create & pick stage')
      }
      setClients([
        ...clients,
        {
          ...selectedClient,
          address: clientForm.address,
        }
      ])
      console.log('created', selectedClient)
    } else if (clientPickMode === 'pick') {
      console.log('picked', selectedClient)
    } else {
      throw new Error('Should not be able to reach here with no pick mode')
    }

    setClientQuery('')
    setIsOpen(false)
    setSelectedClient(null)
  }

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>

        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center">

          <Dialog.Panel className="mx-auto w-[40rem] bg-white p-4 shadow-lg -mt-40">
            <Dialog.Title className="uppercase text-sm font-bold text-gray-600">pick the client</Dialog.Title>

            <div className="flex flex-col relative mt-4">
              <label htmlFor="" className="uppercase text-xs font-bold text-gray-500">
                name
                <span className="rounded-md ml-1 bg-gray-400 text-white px-[4px] text-[9px] inline-block -translate-y-[1px]">required</span>
              </label>
              <Combobox value={selectedClient} onChange={handleComoboxSelect}>
                <Combobox.Input
                  className="p-2 bg-gray-100 rounded-none mt-1"
                  onChange={(event) => setClientQuery(event.target.value)}
                  displayValue={(client: Client) => client?.name || clientQuery}
                  placeholder="start typing clients name"
                />
                <Combobox.Options className="bg-gray-100 absolute top-full inset-x-0">
                  {clientQuery.length && !clients.find((p) => p.name.toLowerCase() === clientQuery.toLowerCase()) ? (
                    <Combobox.Option className="p-2" key="new" value="new">
                      <span className="uppercase font-bold text-xs text-green-600">+ create</span>
                      <span className="inline-block ml-1">{clientQuery}</span>
                    </Combobox.Option>
                  ) : null}
                  {clientResults.map((client) => (
                    <Combobox.Option
                      key={client.id}
                      value={client}
                      className="p-2"
                    >
                      {client.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>

              {clientPickMode === 'createpick' && (
                <div className="flex flex-col mt-4">
                  <label htmlFor="" className="uppercase text-xs font-bold text-gray-500">address</label>
                  <input type="text" className="p-2 bg-gray-100 rounded-none mt-1" placeholder="optional address" />
                </div>
              )}
            </div>

            {clientPickMode !== 'none' && (
              <div className="mt-4">
                {clientPickMode === 'createpick' && (
                  <button
                    onClick={pickClient}
                    className="p-2 bg-orange-200 text-sm uppercase font-bold rounded hover:bg-orange-300 transition text-gray-800">create & pick</button>
                )}
                {clientPickMode === 'pick' && (
                  <button
                    onClick={pickClient}
                    className="p-2 bg-blue-200 text-sm uppercase font-bold rounded hover:bg-blue-300 transition text-gray-800">pick</button>
                )}
              </div>
            )}

          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex h-screen">


        <nav className="w-[14rem] h-full border-gray-100 border-r m-2">

          <p className="text-2xl uppercase text-blue-700 p-4 pl-2 mb-2">
            tnt.
          </p>

          <div className="w-[14rem] grid gap-1">
            <Link className="uppercase font-bold text-gray-700 text-sm p-0 pr-2 pl-2" href="/">Timers</Link>
          </div>

        </nav>

        <main className="m-16 flex flex-col flex-1">

          <form className="flex bg-gray-100" onSubmit={handleTaskCreate}>
            <div className="m-4 flex">
              <button type="button" className="uppercase font-bold text-blue-600">start</button>
            </div>
            <input
              type="text"
              className="w-full p-4 bg-transparent"
              placeholder="what are you working on?"
              onChange={handleTaskDescChange}
              value={newTask.desc}
            />
          </form>

          <div className="rounded-lg mt-8 p-4 grid gap-4">
            {tasks.length === 0 ? (
              <p className="font-thin text-center">you have no running tasks currently.</p>
            ) : null}
            {tasks.map(task => (
              <div key={task.id} className="flex p-2 items-center">
                {Task.isRunning(task)
                  ? (
                    <button
                      onClick={handleStopTask.bind(null, task.id)}
                      className="uppercase font-bold text-sm text-orange-600 mr-4 bg-orange-50 p-1 pr-2 pl-2 rounded-sm"
                    >
                      stop
                    </button>
                  )
                  : (
                    <button
                      onClick={handleStartTask.bind(null, task.id)}
                      className="uppercase font-bold text-sm text-blue-600 mr-4 bg-blue-50 p-1 pr-2 pl-2 rounded-sm"
                    >
                      start
                    </button>
                  )
                }
                <p className="flex-1">{task.title}</p>
                <p className="text-gray-600 font-bold text-sm border border-blue-100 bg-blue-100 p-1 rounded-lg">{Record.elapsed(task.timeline)}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  )
}
