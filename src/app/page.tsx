'use client';

import { useState, ChangeEventHandler, FormEventHandler, useEffect } from "react"
import { ITask, Task } from "@/entity/task";
import { Record } from "@/entity/record";
import { isOdd } from "@/utilities/isOdd";
import PickClientModal from '@/components/PickClientModal'
import { Client, IClient } from "@/entity/client";
import { defCurrencies } from "@/entity/currency";
import { v4 as uuid } from 'uuid'

const CUR_EUR = defCurrencies.find((curr) => curr.name === 'EUR')!

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [newTask, setNewTask] = useState({ desc: '', clientId: '' })

  const [rate, setRate] = useState(50)
  const [isOpen, setIsOpen] = useState(false)
  const [clientModalId, setClientModalId] = useState(uuid())
  const [clients, setClients] = useState<IClient[]>(() => [
    Client.with({ name: 'One Two OU', rate: { currencyId: CUR_EUR.id, rate: 10 } }),
    Client.with({ name: 'Two Three OU', rate: { currencyId: CUR_EUR.id, rate: 20 } }),
    Client.with({ name: 'Three Four OU', rate: { currencyId: CUR_EUR.id, rate: 30 } }),
    Client.with({ name: 'Four Five OU', rate: { currencyId: CUR_EUR.id, rate: 40 } }),
    Client.with({ name: 'Five Six OU', rate: { currencyId: CUR_EUR.id, rate: 50 } }),
  ]);

  const handleClientPick = (client: IClient & { dirty: boolean }) => {
    if (client.dirty) {
      console.log('should also create', client)
    }

    setNewTask((val) => ({ ...val, clientId: client.id }))
    setIsOpen(false)
    setClientModalId(uuid())
  }

  const handleTaskCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTasks(tasks => ([...tasks, Task.with({ title: newTask.desc, createdAt: Date.now() })]))
    setNewTask({ desc: '', clientId: '' })
  }

  const handleTaskDescChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value
    setNewTask((task) => ({ ...task, desc: val }))
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

  const handleChooseClient = () => {
    setIsOpen(true)
  }

  return (
    <>
      <PickClientModal
        key={clientModalId}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        clients={clients}
        currencies={defCurrencies}
        onSubmit={handleClientPick}
      />

      <form className="flex bg-gray-100" onSubmit={handleTaskCreate}>
        <button type="submit" className="uppercase font-bold text-sm text-blue-600 px-4 hover:bg-blue-50">start</button>
        <button type="button" className="uppercase font-bold text-xs text-gray-500 px-4" onClick={handleChooseClient}>
          {newTask.clientId ? clients.find((client) => newTask.clientId === client.id)!.name : 'no client'}
        </button>
        <input
          type="text"
          className="flex-1 p-4 bg-transparent"
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

    </>
  )
}
