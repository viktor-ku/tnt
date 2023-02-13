import { v4 as uuid } from 'uuid'

export interface IClientMeta {
  address?: string
  phone?: string
  email?: string
  notes?: string
}

export interface IClient {
  id: string
  name: string
  meta: IClientMeta
}

export const Client = {
  with(props: Partial<IClient> & { name: string }): IClient {
    return {
      id: props.id || uuid(),
      name: props.name,
      meta: { ...props.meta },
    }
  }
}
