import { v4 as uuid } from 'uuid'

export interface IClientMeta {
  address?: string
  phone?: string
  email?: string
  notes?: string
}

export interface IRate {
  currencyId: string
  rate: number
}

export interface IClient {
  id: string
  name: string
  rate: IRate
  meta: IClientMeta
}

export const Client = {
  with(props: Partial<IClient> & { name: string, rate: IRate }): IClient {
    return {
      id: props.id || uuid(),
      name: props.name,
      rate: props.rate,
      meta: { ...props.meta },
    }
  }
}
