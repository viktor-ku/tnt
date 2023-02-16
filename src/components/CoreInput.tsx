import clsx from "clsx"
import { FocusEventHandler, useRef } from "react"

export interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

export default function CoreInput(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    inputRef.current?.select()

    if (props.onFocus) {
      props.onFocus(e)
    }
  }

  return (
    <input
      ref={inputRef}
      {...props}
      onFocus={handleFocus}
      className={clsx(props.className, "text-sm text-black/90 bg-gray-100 rounded-none select-none p-2")}
    />
  )
}
