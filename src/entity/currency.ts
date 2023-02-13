import { v4 as uuid } from "uuid"

export interface ICurrency {
  id: string
  name: string
}

export const defCurrencies = [
  {
    id: uuid(),
    name: 'USD',
  },
  {
    id: uuid(),
    name: 'EUR',
  }
]
