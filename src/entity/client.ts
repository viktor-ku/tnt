import { v4 as uuid } from 'uuid'
import { C_EUR, C_USD } from './currency'

export interface IClientMeta {
  address?: string
  phone?: string
  email?: string
  notes?: string
}

export interface IClient {
  id: string
  name: string
  rate: number
  currencyId: string
  meta: IClientMeta
}

export const Client = {
  with(props: Partial<IClient> & Pick<IClient, "name" | "rate" | "currencyId">): IClient {
    return {
      id: props.id || uuid(),
      name: props.name,
      rate: props.rate,
      currencyId: props.currencyId,
      meta: { ...props.meta },
    }
  }
}

export const defClients: IClient[] = [
  Client.with({
    id: uuid(),
    name: 'One Company Ltd',
    rate: 10,
    currencyId: C_EUR.id,
  }),
  Client.with({
    id: uuid(),
    name: 'Two Company Ltd',
    rate: 20,
    currencyId: C_EUR.id,
  }),
  Client.with({
    id: uuid(),
    name: 'Three Company Ltd',
    rate: 30,
    currencyId: C_EUR.id,
  }),
  Client.with({
    id: uuid(),
    name: 'Four Company Ltd',
    rate: 40,
    currencyId: C_EUR.id,
  }),
  Client.with({
    id: uuid(),
    name: 'Five Company Ltd',
    rate: 50,
    currencyId: C_EUR.id,
  }),
  Client.with({
    id: uuid(),
    name: 'Sixth USD Company Ltd',
    rate: 60,
    currencyId: C_USD.id,
  }),
]
