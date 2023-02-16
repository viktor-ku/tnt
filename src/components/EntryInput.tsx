import { IClient } from "@/entity/client"
import { ICurrency } from "@/entity/currency"
import { Entry, IEntry } from "@/entity/entry"
import { ChangeEventHandler, useState } from "react"
import CoreInput from "./CoreInput"
import CurrencyPicker from "./CurrencyPicker"

export interface Props {
  clients: IClient[]
  currencies: ICurrency[]
  defaultClientId?: string
  defaultCurrencyId?: string
  rate?: number
  onSubmit(entry: IEntry): void
}

export default function EntryInput(props: Props) {
  const {
    clients,
    currencies,
    rate,
    defaultCurrencyId,
    onSubmit
  } = props

  const [entry, setEntry] = useState<IEntry>(Entry.with({ task: '', rate }))

  const handleOnSubmit = () => {
    onSubmit(entry)
  }

  const handleSelectCurrency = (val: ICurrency) => {
    setEntry((val) => ({ ...val, currencyId: val.id }))

  }

  const handleSelectClient = () => {
  }

  const handleRateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEntry((val) => ({ ...val, rate: Math.max(0, Number(e.target.value)) }))
  }

  const handleDescChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEntry((val) => ({ ...val, task: e.target.value }))
  }

  return (
    <form className="flex bg-gray-100" onSubmit={handleOnSubmit}>
      <button type="submit" className="uppercase font-bold text-sm text-blue-600 px-3">start</button>
      <button type="button" className="uppercase text-xs text-gray-500 px-3" onClick={handleSelectClient}>
        {entry.clientId ? clients.find((client) => entry.clientId === client.id)?.name : 'no client'}
      </button>
      <div className="flex items-center w-12 pl-2">
        <CurrencyPicker
          defaultCurrency={currencies.find((val) => val.id === defaultCurrencyId)!}
          onSubmit={handleSelectCurrency}
          currencies={currencies}
          chip={true}
        />
      </div>
      <CoreInput
        type="number"
        onChange={handleRateChange}
        className="text-sm text-gray-500 w-20 px-3 bg-gray-100"
        value={entry.rate}
      />
      <input
        type="text"
        className="flex-1 p-4 bg-transparent"
        placeholder="what are you working on?"
        onChange={handleDescChange}
        value={entry.task}
      />
    </form>
  )
}
