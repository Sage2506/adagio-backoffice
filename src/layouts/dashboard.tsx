import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (

    <div className="relative flex w-full flex-col">
      <div className="top-0 z-10 h-16 pt-6">
        <div className="sm:px-8 top-(--header-top,--spacing(6)) w-full">
          <div className="mx-auto w-full max-w-7xl lg:px-8">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="relative flex gap-4">
                  <div className="flex flex-1"></div>
                  <div className="flex flex-1 justify-end md:justify-center">
                    <nav className="pointer-events-auto hidden md:block">
                      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                        <li>
                          <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/about">About</a>
                        </li>
                        <li>
                          <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/articles">Articles</a>
                        </li>
                        <li>
                          <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/projects">Projects</a>
                        </li>
                        <li>
                          <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/speaking">Speaking</a>
                        </li>
                        <li>
                          <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/uses">Uses</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="flex justify-end md:flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}