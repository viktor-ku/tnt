import { Client, IClient, IClientMeta } from '@/entity/client'
import { ICurrency } from '@/entity/currency'
import { Dialog, Combobox } from '@headlessui/react'
import { useState } from 'react'

export interface Props {
  open: boolean
  clients: IClient[]
  currencies: ICurrency[]
  onClose(value: boolean): void
  onSubmit(data: IClient & { dirty: boolean }): void
}

export default function PickClientModal(props: Props) {
  const { open, onClose, onSubmit, clients, currencies } = props

  const [clientPickMode, setClientPickMode] = useState<'createpick' | 'pick' | 'none'>('none')
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null)
  const [clientQuery, setClientQuery] = useState('')
  const [rate, setRate] = useState(0)
  const [clientMeta, setClientMeta] = useState<IClientMeta>({
    address: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [currency, setCurrency] = useState<ICurrency>(currencies.find((currency) => currency.name === 'EUR')!)
  const [currencyQuery, setCurrencyQuery] = useState('EUR')

  const clientResults = clientQuery
    ? clients.filter((client) => client.name.toLowerCase().includes(clientQuery.toLowerCase()))
    : clients

  const currencyResults = currencyQuery
    ? currencies.filter((val) => val.name.toLowerCase().includes(currencyQuery.toLowerCase()))
    : currencies

  function handleInputSelect(val: IClient | 'new') {
    if (val === 'new') {
      setSelectedClient(Client.with({ name: clientQuery, rate: { rate: 0, currencyId: currencies.find((curr) => curr.name === 'EUR')!.id } }))
      setClientPickMode('createpick')
    } else {
      setSelectedClient(val)
      setClientPickMode('pick')
    }
  }

  function handleSubmit() {
    if (!selectedClient) {
      throw new Error('did not find the selected client in a create & pick stage')
    }

    if (clientPickMode === 'createpick') {
      const output: IClient = {
        ...selectedClient,
        rate: {
          currencyId: currency.id,
          rate
        },
        meta: {
          ...clientMeta
        }
      }
      setSelectedClient(output)
      onSubmit({ dirty: true, ...output })
    } else if (clientPickMode === 'pick') {
      onSubmit({ dirty: false, ...selectedClient })
    } else {
      throw new Error('Should not be able to reach here with no pick mode')
    }
  }

  function handleSelectCurrency(val: ICurrency) {
    setCurrency(val)
  }

  return (
    <Dialog open={open} onClose={onClose}>

      <div className="fixed inset-0 bg-black/50" aria-hidden="true"></div>

      <div className="fixed inset-0 flex items-center justify-center">

        <Dialog.Panel className="mx-auto w-[40rem] bg-white p-4 shadow-lg -mt-40">
          <Dialog.Title className="uppercase text-sm font-bold text-gray-600">pick the client</Dialog.Title>

          <div className="flex flex-col relative mt-4">
            <label htmlFor="" className="uppercase text-xs font-bold text-gray-500">
              name
              <span className="rounded-md ml-1 bg-gray-400 text-white px-[4px] text-[9px] inline-block -translate-y-[1px]">required</span>
            </label>
            <Combobox value={selectedClient} onChange={handleInputSelect}>
              <Combobox.Input
                className="p-2 bg-gray-100 rounded-none mt-1"
                onChange={(event) => setClientQuery(event.target.value)}
                displayValue={(client: IClient) => client?.name || clientQuery}
                placeholder="start typing clients name"
                autoComplete="off"
              />
              <Combobox.Options className="bg-gray-100 absolute top-full inset-x-0">
                {clientQuery.length && !clients.find((p) => p.name.toLowerCase() === clientQuery.toLowerCase()) ? (
                  <Combobox.Option className="p-2" key="new" value="new">
                    <span className="uppercase font-bold text-xs text-green-600">+ create</span>
                    <span className="inline-block ml-1">{clientQuery}</span>
                  </Combobox.Option>
                ) : null}
                {clientResults.map((client) => (
                  <Combobox.Option
                    key={client.id}
                    value={client}
                    className="p-2"
                  >
                    {client.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>

            {clientPickMode === 'createpick' && (
              <div className="flex flex-col">

                <div className="flex flex-col mt-4">
                  <label htmlFor="rate" className="uppercase text-xs font-bold text-gray-500">hourly rate</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      id="rate"
                      type="number"
                      className="p-2 bg-gray-100 rounded-none mt-1 flex-1"
                      placeholder="hourly rate, e.g. 20"
                    />
                    <div className="relative">
                      <Combobox value={currency} onChange={handleSelectCurrency}>
                        <Combobox.Input
                          className="p-2 bg-gray-100 rounded-none mt-1 w-full"
                          onChange={(e) => setCurrencyQuery(e.target.value)}
                          displayValue={(client: IClient) => client?.name || clientQuery}
                          placeholder="start typing clients name"
                          autoComplete="off"
                        />
                        <Combobox.Options className="bg-gray-100 absolute top-full w-full">
                          {currencyResults.map((curr) => (
                            <Combobox.Option
                              key={curr.id}
                              value={curr}
                              className="p-2"
                            >
                              {curr.name}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </Combobox>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <label htmlFor="email" className="uppercase text-xs font-bold text-gray-500">email</label>
                  <input
                    value={clientMeta.email}
                    onChange={(e) => setClientMeta((meta) => ({ ...meta, email: e.target.value }))}
                    id="email"
                    type="email"
                    className="p-2 bg-gray-100 rounded-none mt-1"
                    placeholder="optional email"
                  />
                </div>
                <div className="grid gap-2 grid-cols-2 justify-between mt-4">
                  <div className="flex flex-col">
                    <label htmlFor="address" className="uppercase text-xs font-bold text-gray-500">address</label>
                    <input
                      value={clientMeta.address}
                      onChange={(e) => setClientMeta((meta) => ({ ...meta, address: e.target.value }))}
                      id="address"
                      type="text"
                      className="p-2 bg-gray-100 rounded-none mt-1"
                      placeholder="optional address"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="phone" className="uppercase text-xs font-bold text-gray-500">phone</label>
                    <input
                      value={clientMeta.phone}
                      onChange={(e) => setClientMeta((meta) => ({ ...meta, phone: e.target.value }))}
                      id="phone"
                      type="tel"
                      className="p-2 bg-gray-100 rounded-none mt-1"
                      placeholder="optional phone"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label htmlFor="notes" className="uppercase text-xs font-bold text-gray-500">notes</label>
                  <input
                    value={clientMeta.notes}
                    onChange={(e) => setClientMeta((meta) => ({ ...meta, notes: e.target.value }))}
                    id="notes"
                    type="text"
                    className="p-2 bg-gray-100 rounded-none mt-1"
                    placeholder="notes"
                  />
                </div>
              </div>
            )}
          </div>

          {clientPickMode !== 'none' && (
            <div className="mt-4">
              {clientPickMode === 'createpick' && (
                <button
                  onClick={handleSubmit}
                  className="p-2 bg-orange-200 text-sm uppercase font-bold rounded hover:bg-orange-300 transition text-gray-800"
                >
                  create & pick
                </button>
              )}
              {clientPickMode === 'pick' && (
                <button
                  onClick={handleSubmit}
                  className="p-2 bg-blue-200 text-sm uppercase font-bold rounded hover:bg-blue-300 transition text-gray-800"
                >
                  pick
                </button>
              )}
            </div>
          )}

        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
