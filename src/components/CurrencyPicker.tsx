import { ICurrency } from "@/entity/currency";
import { Combobox } from '@headlessui/react'
import clsx from "clsx";
import { ChangeEventHandler, KeyboardEventHandler, useMemo, useRef, useState } from "react";

export interface Props {
  currencies: ICurrency[]
  defaultCurrency: ICurrency
  onSubmit(currency: ICurrency): void
  chip?: boolean
}

export default function CurrencyPicker(props: Props) {
  const { defaultCurrency, currencies, onSubmit, chip = false } = props

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
    <div className={clsx({"flex self-stretch": !chip}, "relative")}>
      <Combobox value={currency} onChange={handleSelectCurrency}>
        {({ open }) => (
          <>
            <Combobox.Input
              ref={inputRef}
              onFocus={handleInputFocus}
              className={clsx("p-2 text-xs uppercase w-full bg-gray-100", { "rounded-md bg-gray-200 text-center": chip })}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              displayValue={(curr: ICurrency | null) => curr?.name || query}
              placeholder="e.g. USD"
              autoComplete="off"
            />
            {(open || showOptions) ? (
              <Combobox.Options static className="bg-white absolute top-12 border border-black/10">
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
