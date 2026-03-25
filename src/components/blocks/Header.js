'use client'

import { useContext, useState } from 'react'
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { DContext } from '../../context/Datacontext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuth, handleLogout } = useContext(DContext)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-6">
        <a href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/80 flex items-center justify-center text-white font-black">W</div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">Wind Sprayer</p>
            <p className="text-xs text-cyan-200">Smart farm automation</p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-medium text-slate-200 hover:text-white">Home</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = '/login')}
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600 transition"
            >
              Login
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="md:hidden">
        <div className="fixed inset-0 bg-slate-900/70" aria-hidden="true" />
        <DialogPanel className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-950 p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg font-semibold text-white">Menu</p>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <a href="/" className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-100 hover:bg-slate-800">Home</a>
          </div>

          <div className="mt-6">
            {isAuth ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => (window.location.href = '/login')}
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                Login
              </button>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

