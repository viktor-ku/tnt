'use client'

import './globals.css';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './layout.module.css'
import {
  HomeIcon,
  UsersIcon,
  PlayIcon,
  AdjustmentsVerticalIcon,
  Cog8ToothIcon as CogIcon
} from '@heroicons/react/24/outline'
import { Entry } from '@/entity/entry';

const navigation = [
  { name: 'Home', icon: HomeIcon, href: '#', current: true },
  { name: 'Invoices', icon: UsersIcon, href: '/invoices', count: 3, current: false },
  { name: 'Settings', icon: CogIcon, href: '/settings', current: false },
]

function SideNav() {
  return (
    <aside className={clsx("w-60")}>
      <div className="flex h-full flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  item.current
                    ? 'bg-gray-100 text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={clsx(
                    item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{item.name}</span>
                {item.count ? (
                  <span
                    className={clsx(
                      item.current ? 'bg-white' : 'bg-gray-100 group-hover:bg-gray-200',
                      'ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full'
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <a href="#" className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tom Cook</p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </aside>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className={clsx("h-screen w-screen overflow-hidden flex")}>

          <SideNav />

          <main
            className={clsx("bg-gray-50 overflow-y-scroll border-gray-100 flex-1")}
          >
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}
