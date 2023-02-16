import { ICurrency } from "@/entity/currency";
import { Combobox } from '@headlessui/react'
import { ChangeEventHandler, KeyboardEventHandler, useMemo, useRef, useState } from "react";

export interface Props {
  currencies: ICurrency[]
  defaultCurrency: ICurrency
  onSubmit(currency: ICurrency): void
}

export default function CurrencyPicker(props: Props) {
  const { defaultCurrency, currencies, onSubmit } = props

  const [currency, setCurrency] = useState<ICurrency>(defaultCurrency)
  const [query, setQuery] = useState(currency.name)
  const [showOptions, setShowOptions] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleSelectCurrency(val: ICurrency) {
    setCurrency(val)
    onSubmit(val)
    handleInputBlur()
  }

  const handleInputFocus = () => {
    setShowOptions(true)
    inputRef.current?.select()
  }

  const handleInputBlur = () => {
    inputRef.current?.blur()
    setShowOptions(false)
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setShowOptions(false)
    setQuery(e.target.value)
  }

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') {
      handleInputBlur()
    }
  }

  const currencyResults = useMemo(() => {
    if (!query || showOptions) {
      return currencies
    }

    return currencies.filter((val) => val.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, showOptions])

  return (
    <div className="relative">
      <Combobox value={currency} onChange={handleSelectCurrency}>
        {({ open }) => (
          <>
            <Combobox.Input
              ref={inputRef}
              onFocus={handleInputFocus}
              className="p-2 bg-gray-200 rounded-md text-xs uppercase w-full text-center"
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              displayValue={(curr: ICurrency | null) => curr?.name || query}
              placeholder="e.g. USD"
              autoComplete="off"
            />
            {(open || showOptions) ? (
              <Combobox.Options static className="bg-white absolute top-12 border border-black/10 w-min">
                {currencyResults.map((curr) => (
                  <Combobox.Option
                    key={curr.id}
                    value={curr}
                    className="p-2 font-bold text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
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
