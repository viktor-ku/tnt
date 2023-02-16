import { ICurrency } from "@/entity/currency";
import { Combobox } from '@headlessui/react'
import { ChangeEventHandler, useMemo, useState } from "react";

export interface Props {
  currencies: ICurrency[]
  defaultCurrency: ICurrency
  onSubmit(currency: ICurrency): void
}

export default function CurrencyPicker(props: Props) {
  const { defaultCurrency, currencies, onSubmit } = props

  const [currency, setCurrency] = useState<ICurrency>(defaultCurrency)
  const [query, setQuery] = useState(currency.name)
  const [forceShowOptions, setForceShowOptions] = useState(false)

  function handleSelectCurrency(val: ICurrency) {
    setCurrency(val)
    setForceShowOptions(false)
    onSubmit(val)
  }

  const showAllOptions = () => {
    setQuery('')
    setForceShowOptions(true)
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForceShowOptions(false)
    setQuery(e.target.value)
  }

  const currencyResults = useMemo(() => {
    if (!query || forceShowOptions) {
      return currencies
    }

    return currencies.filter((val) => val.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, forceShowOptions])

  return (
    <div className="relative">
      <Combobox value={currency} onChange={handleSelectCurrency}>
        {({ open }) => (
          <>
            <Combobox.Input
              onFocus={showAllOptions}
              className="p-2 bg-gray-200 rounded-md text-xs uppercase w-full text-center"
              onChange={handleInputChange}
              displayValue={(curr: ICurrency | null) => curr?.name || query}
              placeholder="e.g. USD"
              autoComplete="off"
            />
            {(open || forceShowOptions) ? (
              <Combobox.Options static className="bg-white absolute top-12 border border-black/10 w-min">
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
            ) : null}
          </>
        )}
      </Combobox>
    </div>
  )
}
