'use client';

import { useState, ChangeEventHandler, FormEventHandler, Key, useEffect } from "react"
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash'

interface Task {
  id: string,
  title: string,
  timeline: number[],
  createdAt: number,
}

const SECONDS = 1000
const MINUTE = SECONDS * 60
const HOUR = MINUTE * 60

function fmt(ms: number): string {
  const hours = Math.floor(ms / HOUR)
  ms -= hours * HOUR

  const minutes = Math.floor(ms / MINUTE)
  ms -= minutes * MINUTE

  const seconds = Math.floor(ms / SECONDS)

  const fmt = []

  if (hours) fmt.push(`${hours}h`)
  if (minutes) fmt.push(`${minutes}m`)
  if (seconds) fmt.push(`${seconds}s`)

  return fmt.join(' ')
}

function elapsed(timeline: number[]): string {
  const pairs = isOdd(timeline.length) ? [...timeline, Date.now()] : [...timeline];

  const total = chunk(pairs, 2)
    .reduce((acc, [start, end]) => {
      return acc + (end - start)
    }, 0)

  return fmt(total)
}

function isOdd(n: number): boolean {
  return n % 2 !== 0
}

function isEven(n: number): boolean {
  return !isOdd(n)
}

function createTask({ title, createdAt }: Pick<Task, 'title' | 'createdAt'>): Task {
  return {
    id: uuid(),
    title,
    timeline: [createdAt],
    createdAt,
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ desc: '' })

  const handleTaskCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTasks(tasks => ([...tasks, createTask({ title: newTask.desc, createdAt: Date.now() })]))
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

  const handleStopTask = (id: string) => {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            timeline: [...task.timeline, Date.now()]
          }
        }
        return task
      })
    })
  }

  return (
    <div className="m-16 flex flex-col">

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

      <div className="rounded-lg w-[40rem] mt-8 p-4 m-auto grid gap-4">
        <h3 className="uppercase font-thin text-xl">active.</h3>
        {tasks.length === 0 ? (
          <p className="font-thin text-center">you have no running tasks currently.</p>
        ) : null}
        {tasks.filter(task => isOdd(task.timeline.length)).map(task => (
          <div key={task.title as Key} className="flex p-2 items-center">
            <button
              onClick={handleStopTask.bind(null, task.id)}
              className="uppercase font-bold text-sm text-orange-600 mr-4 bg-orange-50 p-1 pr-2 pl-2 rounded-sm"
            >
              stop
            </button>
            <p className="flex-1">{task.title}</p>
            <p className="text-gray-600 font-bold text-sm border border-blue-100 bg-blue-100 p-1 rounded-lg">{elapsed(task.timeline) || '0s'}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg w-[40rem] mt-8 p-4 m-auto grid gap-4">
        <h3 className="uppercase font-thin text-xl">paused.</h3>
        <p className="font-thin text-center">you have no paused tasks currently.</p>
        {tasks.filter(task => !isOdd(task.timeline.length)).map(task => (
          <div key={task.title as Key} className="flex p-2 items-center">
            <button
              onClick={handleStopTask.bind(null, task.id)}
              className="uppercase font-bold text-sm text-blue-600 mr-4 bg-blue-50 p-1 pr-2 pl-2 rounded-sm"
            >
              start
            </button>
            <p className="flex-1">{task.title}</p>
            <p className="text-gray-600 font-bold text-sm border border-blue-100 bg-blue-100 p-1 rounded-lg">{elapsed(task.timeline) || '0s'}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
