import { BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'
import { FaChessKnight } from 'react-icons/fa'

export function Footer() {
  return (
    <div className="flex flex-col w-full text-black/70">
      <div className="flex items-center justify-between gap-3 md:-mx-28 -mx-4">
        <hr className="border border-black/5 w-full" />
        <FaChessKnight size={25} />
        <hr className="border border-black/5 w-full" />
      </div>
      <div className="relative flex flex-col md:flex-row justify-between text-sm py-6 gap-2 md:gap-0">
        <div className="w-full md:w-[30%] flex justify-center md:justify-start">
          <p className="w-fit">
            <span>&copy;</span> 2024 All rights reserved
          </p>
        </div>
        <div className="flex gap-6 justify-center md:justify-start">
          <span>About</span>
          <span>Docs</span>
          <span>Contact</span>
        </div>
        <div className="flex gap-4 w-full md:w-[30%] justify-center md:justify-end">
          <BsTwitter />
          <BsGithub />
          <BsInstagram />
        </div>
      </div>
    </div>
  )
}
