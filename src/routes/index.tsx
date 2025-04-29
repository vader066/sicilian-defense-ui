import { createFileRoute } from '@tanstack/react-router'

import { Footer } from '@/components/footer'
import Hero from '@/components/landing-hero'
import Navbar from '@/components/navbar'
import { FeatureCard } from '@/components/ui/feature-card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="px-4 md:px-20">
      <div className="relative px-4 md:px-28 md:-mx-28 -mx-4">
        <div className="absolute inset-0 bg-gradient-to-tl from-white via-[#72EFDD] to-[#80FFDB] opacity-50 -z-[5]"></div>
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-br from-white to-[#80FFDB] -z-[3]"></div>
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-r from-white via-white to-[#80FFDB] -z-[3]"></div>
        <div className="absolute inset-0  bg-gradient-to-t from-white via-transparent to-transparent -z-[2]"></div>
        <Navbar />
        <Hero />
      </div>
      <section className="flex flex-col gap-5 py-6 mb-28">
        <p className="text-xl md:text-3xl font-bold">
          Designed for an optimised{' '}
          <span className="text-cyan-300">User Experience</span>
        </p>
        <p className="w-[80%] text-black/70">
          Integrates both online and in-person tournaments, ensuring seamless
          handling of player data, tournament results, and rating updates.
        </p>
        <div className="flex flex-col md:flex-row w-full  justify-between gap-6 mt-10">
          <FeatureCard
            title="Efficiency"
            description="Save time and reduce errors with automated data fetching and rating calculations."
          />
          <FeatureCard
            title="Flexibility"
            description="Support both online and in-person tournament formats from popular platforms like Lichess."
          />
          <FeatureCard
            title="Scalability"
            description="Handle tournaments of any size, from small club events to large inter-organization competitions."
          />
        </div>
      </section>
      <section className="flex flex-col gap-5 py-6 mb-28">
        <p className="text-xl md:text-3xl font-bold">
          Key <span className="text-cyan-300">Features</span>
        </p>
        <p className="w-[80%] text-black/70">
          Integrates both online and in-person tournaments, ensuring seamless
          handling of player data, tournament results, and rating updates.
        </p>
        <div className="flex flex-col md:flex-row w-full justify-between gap-6 mt-10">
          <FeatureCard
            title="Store and Register Players"
            description="Maintain a detailed database of all registered players, including their names and current ratings."
          />
          <FeatureCard
            title="Integration with Online Chess Platforms"
            description="Connect with Lichess to fetch and store tournament results automatically"
          />
          <FeatureCard
            title="User-Friendly Interface"
            description="Intuitive dashboards for managing players, online and in-person tournaments, and ratings."
          />
        </div>
        <div className="w-full flex justify-center">
          <a
            href="/dashboard/home"
            className="p-1 text-white text-sm border-2 bg-black border-green-400 rounded-md"
          >
            Try It Now
          </a>
        </div>
      </section>
      <div className="flex flex-col md:flex-row w-full items-start md:items-center my-28">
        <div className="flex-1 flex flex-col gap-1">
          <span>Getting Started</span>
          <p className="font-bold text-xl md:text-3xl mb-3">
            Start Managing your Chess Club
          </p>
          <p className="text-black/50">Be as productive as you can be.</p>
        </div>
        <div className="flex gap-3 h-fit mt-8 md:mt-0">
          <a
            href="#"
            className="p-2 text-white text-sm border-2 bg-black border-green-400 rounded-md"
          >
            Get Started
          </a>
          <a
            href="#"
            className="p-2 text-sm border-2  border-black/10 rounded-md"
          >
            Explore Examples
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
