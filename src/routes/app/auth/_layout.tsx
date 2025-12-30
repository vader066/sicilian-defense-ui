import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/app/auth/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="w-full flex flex-col h-screen p-6 bg-[#f8f8f8]">
      <section className="w-full h-full pt-10 flex gap-8 justify-between items-center">
        <section className="flex-1 h-full flex items-center justify-between flex-col">
          <div className="flex flex-col w-full h-fit gap-2">
            <p className="text-center mb-5 font-semibold">
              LARGEST IMAGE SOURCE
            </p>
            <h1 className="relative text-5xl text-center">
              <span className="absolute h-5 w-[50%] z-0 bottom-0 translate-y-[30%] rounded-full bg-[#d1fe95] left-1/2 -translate-x-[50%]"></span>
              <p className="relative z-10">
                POWERED BY
                <br />
                CREATORS AROUND
              </p>
            </h1>
            <h1 className="text-5xl text-center flex gap-3 justify-center items-center">
              <p>THE WORLD.</p>
              <span className="flex relative">
                <div className="relative size-9 rounded-full bg-[#334821]" />
                <div className="relative -ml-[12%] size-9 rounded-full bg-[#4d7514]" />
                <div className="relative -ml-[12%] size-9 rounded-full bg-[#79b82f]" />
                <div className="relative -ml-[12%] size-9 rounded-full bg-[#b4ff52]" />
              </span>
            </h1>
          </div>
          <div className="flex flex-col text-xs gap-3">
            <p>Don't have an account?</p>
            <a
              href="#"
              className="px-2 py-1 border-b w-fit border-black flex gap-2 items-center"
            >
              <span>Create account</span>
              <ArrowRight size={14} />
            </a>
          </div>
          <div
            style={{ backgroundImage: `url(/images/sign-in-sm-v2.jpg)` }}
            className="w-full rounded-2xl text-white font-normal text-sm py-14 flex justify-center gap-4 bg-cover bg-center"
          >
            <p>About Us</p>
            <p>
              Over 3 million free high-resolution
              <br />
              images brought to you by the world's
              <br />
              most generous community of
              <br />
              photographers.
            </p>
          </div>
        </section>
        <section
          style={{ backgroundImage: `url(/images/sign-in-lg.jpg)` }}
          className="flex-1 h-full flex flex-col rounded-2xl bg-cover bg-center items-center justify-center "
        >
          <Outlet />
        </section>
      </section>
    </main>
  )
}
