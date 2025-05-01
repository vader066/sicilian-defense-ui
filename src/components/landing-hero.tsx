import { RiArrowDropRightLine } from 'react-icons/ri'

function Hero() {
  return (
    <div className="flex w-full min-h-max py-8 md:py-20 mb-5 md:mb-0">
      <div className="flex-3 text-center md:text-left">
        <div className="flex flex-col gap-6 md:w-2/3 w-full items-center md:items-start">
          <span className="p-2 text-xs bg-black/5 rounded-md w-max">
            Simplify chess tournaments
          </span>
          <p className="text-3xl md:text-5xl font-bold">
            Streamlined Chess Tournament Management
          </p>
          <p className="text-black/70 text-sm md:text-base">
            Manage your club tournaments with ease. A comprehensive application
            designed to streamline the management of chess club tournaments.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <a
              href="/app/auth/sign-in"
              className="rounded-md bg-black text-white p-1 px-2 border-2 border-green-400"
            >
              Sign In
            </a>
            <a href="#" className="flex gap-1 items-center min-h-full">
              Open in GitHub{' '}
              <span>
                <RiArrowDropRightLine size={30} />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="relative md:flex flex-2 hidden items-center">
        <img
          src="/images/transparent-queen.png"
          alt="chess queen"
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default Hero
