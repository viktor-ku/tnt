'use client'

import CoreInput from '@/components/CoreInput'
import CurrencyPicker from '@/components/CurrencyPicker'
import { C_EUR, defCurrencies, ICurrency } from '@/entity/currency'
import clsx from 'clsx'
import { useState } from 'react'
import styles from './settings.module.css'

export default function SettingsPage() {
  const [rate, setRate] = useState(0)
  const [currency, setCurrency] = useState<ICurrency>(C_EUR)

  const handleSelectCurrency = (val: ICurrency) => {

  }

  return (
    <div className={clsx(styles.back, "flex justify-center pb-20 pt-16")}>
      <main className="w-2/3 bg-white shadow-lg grid grid-cols-1 gap-2">

        <fieldset className="flex flex-col m-4">
          <label htmlFor="rate" className="uppercase text-xs font-bold text-gray-500">default hourly rate</label>
          <div className="flex mt-1">
            <div className="flex items-center w-16">
              <CurrencyPicker
                defaultCurrency={currency}
                onSubmit={handleSelectCurrency}
                currencies={defCurrencies}
              />
            </div>
            <CoreInput
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              id="rate"
              type="number"
              className="flex-1"
              placeholder="hourly rate, e.g. 20"
            />
          </div>
        </fieldset>

      </main>
    </div>
  )
}
