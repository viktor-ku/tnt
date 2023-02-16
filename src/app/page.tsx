'use client';

import { useState, ChangeEventHandler, FormEventHandler, useEffect, useRef } from "react"
import { ITask, Task } from "@/entity/task";
import { Record } from "@/entity/record";
import { isOdd } from "@/utilities/isOdd";
import PickClientModal from '@/components/PickClientModal'
import { Client, IClient } from "@/entity/client";
import { C_EUR, defCurrencies, ICurrency } from "@/entity/currency";
import { v4 as uuid } from 'uuid'
import CurrencyPicker from "@/components/CurrencyPicker";

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [rate, setRate] = useState(50)
  const [newTask, setNewTask] = useState({ desc: '', clientId: '', rate: 50 })
  const numberInputRef = useRef<HTMLInputElement | null>(null)

  const [currency, setCurrency] = useState<ICurrency>(defCurrencies.find((currency) => currency.name === 'EUR')!)
  const [isOpen, setIsOpen] = useState(false)
  const [clientModalId, setClientModalId] = useState(uuid())
  const [clients, setClients] = useState<IClient[]>(() => [
    Client.with({ name: 'One Two OU', rate: { currencyId: C_EUR.id, rate: 10 } }),
    Client.with({ name: 'Two Three OU', rate: { currencyId: C_EUR.id, rate: 20 } }),
    Client.with({ name: 'Three Four OU', rate: { currencyId: C_EUR.id, rate: 30 } }),
    Client.with({ name: 'Four Five OU', rate: { currencyId: C_EUR.id, rate: 40 } }),
    Client.with({ name: 'Five Six OU', rate: { currencyId: C_EUR.id, rate: 50 } }),
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
    setNewTask({ desc: '', clientId: '', rate: 50 })
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

  const handleTaskNumberInputFocus = () => {
    numberInputRef.current?.select()
  }

  function handleSelectCurrency(val: ICurrency) {
    setCurrency(val)
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
        <button type="submit" className="uppercase font-bold text-sm text-blue-600 px-3">start</button>
        <button type="button" className="uppercase text-xs text-gray-500 px-3" onClick={handleChooseClient}>
          {newTask.clientId ? clients.find((client) => newTask.clientId === client.id)!.name : 'no client'}
        </button>
        <div className="flex items-center w-12 pl-2">
          <CurrencyPicker
            defaultCurrency={currency}
            onSubmit={handleSelectCurrency}
            currencies={defCurrencies}
            chip={true}
          />
        </div>
        <input
          type="number"
          onChange={(e) => setNewTask((val) => ({ ...val, rate: Number(e.target.value) }))}
          className="text-sm text-gray-500 w-20 px-3 bg-gray-100"
          ref={numberInputRef}
          onFocus={handleTaskNumberInputFocus}
          value={newTask.rate}
        />
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
