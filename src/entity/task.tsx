import { v4 as uuid } from "uuid";
import { IRecord, Record } from "./record";

export interface ITask {
  id: string,
  title: string,
  timeline: IRecord[],
}

export const Task = {
  with({ title, createdAt }: { title: string, createdAt: number }): ITask {
    return {
      id: uuid(),
      title,
      timeline: [Record.at(createdAt)],
    }
  },
  createdAt(self: ITask): Date {
    if (!self.timeline.length)
      throw new Error('Found an empty timeline')
    return new Date(self.timeline[0].at)
  }
}
