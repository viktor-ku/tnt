import { v4 as uuid } from 'uuid'

export interface IEntry {
  id: string
  task: string
  clientId?: string
  currencyId?: string
  rate: number
  start?: Date
  end?: Date
  createdAt: Date
}

export const Entry = {
  with(props: Partial<IEntry> & Pick<IEntry, "task">): IEntry {
    return {
      id: props.id || uuid(),
      task: props.task,
      clientId: props.clientId,
      currencyId: props.currencyId,
      rate: Math.max(props.rate === undefined ? 0 : props.rate, 0),
      start: props.start,
      end: props.end,
      createdAt: props.createdAt || new Date()
    }
  }
}
