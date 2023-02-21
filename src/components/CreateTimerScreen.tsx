import { IClient } from '@/entity/client'
import { C_EUR, ICurrency } from '@/entity/currency'
import { Dialog, Combobox } from '@headlessui/react'
import { Ref, RefObject, useState } from 'react'

export interface Props {
  open: boolean
  clients: IClient[]
  currencies: ICurrency[]
  onClose(value: boolean): void
  onSubmit(data: IClient & { dirty: boolean }): void
  originalInputRef: RefObject<HTMLInputElement | null>
}

export default function CreateTimerScreen(props: Props) {
  const { open, onClose, onSubmit, clients, currencies, originalInputRef } = props

  const [currency, setCurrency] = useState<ICurrency>(C_EUR)
  const [rate, setRate] = useState(0)

  const offsetTop = originalInputRef?.current?.offsetTop
  const offsetLeft = originalInputRef?.current?.offsetLeft
  const width = originalInputRef?.current?.clientWidth

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/60" aria-hidden="true"></div>

      <div className="fixed inset-0">

      </div>
    </Dialog>
  )
}
