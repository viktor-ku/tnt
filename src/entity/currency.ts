import { v4 as uuid } from "uuid"

export interface ICurrency {
  id: string
  name: string
}

export const C_EUR = {
  id: uuid(),
  name: 'EUR',
}
export const C_USD = {
  id: uuid(),
  name: 'USD',
}

export const defCurrencies = [
  C_EUR,
  C_USD,
]
