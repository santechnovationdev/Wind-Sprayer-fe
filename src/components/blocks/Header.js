'use client'

import { useContext, useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DContext } from '../../context/Datacontext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const { isAuth, handleLogout } = useContext(DContext)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/10 bg-white/90 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/70 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
            <span className="text-lg font-black">W</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Wind Sprayer</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smart farm automation</p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-primary-300"
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = '/login')}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Login
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-primary-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="md:hidden">
        <div className="fixed inset-0 bg-slate-950/50" aria-hidden="true" />
        <DialogPanel className="fixed right-0 top-0 h-full w-full max-w-sm rounded-l-3xl bg-slate-950 p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg font-semibold text-white">Menu</p>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 transition hover:bg-slate-800"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-primary-300 hover:bg-slate-800"
            >
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            </button>

            {isAuth ? (
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => (window.location.href = '/login')}
                className="rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
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

