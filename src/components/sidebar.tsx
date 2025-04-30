import { BsClockHistory } from 'react-icons/bs'
import { Link as RouterLink, type LinkProps } from '@tanstack/react-router'

import { FaChessKnight } from 'react-icons/fa'
import { GiTrophy } from 'react-icons/gi'
import { HiHome } from 'react-icons/hi2'
import { LuSettings } from 'react-icons/lu'
import { PiRanking, PiSignOutFill } from 'react-icons/pi'
import { RiSunFill } from 'react-icons/ri'

function SideBar() {
  return (
    <div className="fixed top-0 left-0 flex flex-col gap-3 h-screen w-max p-3 bg-slate-800">
      <div className="p-2 pb-4 border-b border-b-white/40">
        <FaChessKnight size={40} color="white" />
      </div>
      <ul className="flex flex-col gap-3 h-full [&>li:last-child]:mt-auto">
        <Link to="/app/dashboard/home">
          <HiHome size={30} color="white" />
        </Link>
        <Link to="/app/dashboard/leaderboard">
          <PiRanking size={30} color="white" />
        </Link>
        <Link to="/app/dashboard/history">
          <BsClockHistory size={30} color="white" />
        </Link>
        <Link to="/">
          <GiTrophy size={30} color="white" />
          {/* <HiTrophy size={30} color="white" /> */}
        </Link>
        <Link to="/app/dashboard/settings">
          <LuSettings size={30} color="white" />
        </Link>
        <Link to="/">
          <RiSunFill size={30} color="white" />
        </Link>
        <Link to="/">
          <PiSignOutFill size={30} color="white" />
        </Link>
      </ul>
    </div>
  )
}

function Link({ children, ...props }: LinkProps) {
  return (
    <li className="flex items-center justify-center rounded-md hover:bg-white/15 py-3">
      <RouterLink {...props}>{children}</RouterLink>
    </li>
  )
}

export default SideBar
