import clsx from 'clsx'
import Link from 'next/link'
import './globals.css'
import styles from './layout.module.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className={clsx("h-screen w-screen overflow-hidden", styles.body)}>

          <div className={clsx(styles.logo, "flex items-center")}>
            <p className="text-xl text-blue-700 pl-2">
              fancy.
            </p>
          </div>

          <aside className={clsx("pt-1", styles.side)}>
            <div className="grid gap-1">
              <Link className="uppercase font-bold text-gray-700 text-sm p-0 pr-2 pl-2" href="/">Timers</Link>
            </div>
          </aside>

          <header className={clsx(styles.header, "flex justify-end items-center pr-8")}>
            <div>
              <button className="uppercase font-bold text-blue-400 p-2 text-sm hover:bg-blue-50 transition">sign in</button>
            </div>
          </header>

          <main
            className={clsx(styles.main, "bg-gray-50 overflow-y-scroll border-gray-100 border-t border-l rounded-md")}
          >
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}
