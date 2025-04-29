import {
  FaChessKnight,
  FaDiscord,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'

function Navbar() {
  return (
    <div className="relative flex justify-between h-max py-3">
      <div className="md:hidden flex items-center w-[30%]">
        <GiHamburgerMenu size={20} />
      </div>
      <div className="w-auto md:w-[30%]">
        {/* <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:-translate-x-0"> */}
        <FaChessKnight size={40} color="green" />
      </div>
      <ul className="md:flex gap-20 hidden">
        <li className="content-center">About</li>
        <li className="content-center">Docs</li>
        <li className="content-center">Contact</li>
      </ul>
      <ul className="flex gap-4 md:gap-6 min-h-full justify-end items-center w-[30%]">
        <li className="flex items-center justify-center">
          <FaTwitter size={15} />
        </li>
        <li className="flex items-center justify-center">
          <FaDiscord size={15} />
        </li>
        <li className="flex items-center justify-center">
          <FaInstagram size={15} />
        </li>
      </ul>
    </div>
  )
}

export default Navbar
