'use client';

import { useState, ChangeEventHandler, FormEventHandler, useEffect } from "react"
import { ITask, Task } from "@/entity/task";
import { Record } from "@/entity/record";
import { isOdd } from "@/utilities/isOdd";

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [newTask, setNewTask] = useState({ desc: '' })

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
            <p className="text-gray-600 font-bold text-sm border border-blue-100 bg-blue-100 p-1 rounded-lg">{Record.elapsed(task.timeline) || '0s'}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
