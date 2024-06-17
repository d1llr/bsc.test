import Logo from "../../../images/icons/logotype.png"
import ExitIcon from "../../images/icons/exit-account.svg"
import BurgerOpen from "../../../images/icons/mob-burger-open.svg"
import BurgerClose from "../../../images/icons/mob-burger-close.svg"
import Discord from "../../images/icons/discord.svg"
import TelegramRU from "../../images/icons/tg_ru.svg"
import TelegramEN from "../../images/icons/tg_eng.svg"
import Mail from "../../images/icons/mail.svg"
import X from "../../images/icons/x.svg"

import tg_ru from '../../../images/icons/tg_ru.svg'
import tg_en from '../../../images/icons/tg_en.svg'
import x from '../../../images/icons/x.svg'
import discord from '../../../images/icons/discord.svg'

import ActiveLink from "../../helpers/ActilveLink"
import Wallet from "./wallet/Wallet"
import { useDisconnect } from "wagmi"
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setMobBurger } from "./Header.slice"
import Image from "next/image"
import ConnectButton from "../ConnectButton"



const Header = () => {
  // const mobBurgerOpen = false;
  const { disconnectAsync } = useDisconnect()
  const dispatch = useAppDispatch()
  const mobBurger = useAppSelector(state => state.mobBurger.open)
  // const [mobBurger, setMobBurger] = useState<boolean>(false)


  const handleDisconnect = async () => {
    await disconnectAsync()
  }

  return (

    <header className="fixed mt-5 z-40 w-full">
      <div className={`${mobBurger ? 'mob_element_close' : 'mob_element_open'} wrapper w-full`}>

        <div id="header" className=" justify-between p-4 flex items-center bg-lightGray rounded-[20px] text-white">

          <div className="gap-5 flex flex-col w-fit max-w-[15%] max-[1050px]:max-w-[fit-content] max-w-[1200px]:hidden">
            <ActiveLink href="/" >
              <Image src={Logo} alt="logotype" className="max-w-[120px] max-[600px]:max-w-[95px]" />
              {/* {import.meta.env.VITE_APP_DEVELOPMENT ?? ''} */}

            </ActiveLink>

          </div>

          <div className="flex flex-row gap-6 justify-center font-extrabold items-center lg:md:text-base text-sm font-orbitron max-[1200px]:hidden">
            <ActiveLink href='/'  >
              PAC BSC
            </ActiveLink>
            <ActiveLink
              href="https://pac10.pac-staking.com/"
            >
              PAC 10000
            </ActiveLink>

            <ActiveLink
              href="https://solo.pac-staking.com/"
            >
              PAC SOLO
            </ActiveLink>

            <ActiveLink
              href="https://octa200.pac-staking.com/"
            >
              OCTA 200
            </ActiveLink>

            <ActiveLink
              href="https://octa1000.pac-staking.com/"
            >
              OCTA 1000
            </ActiveLink>

            <ActiveLink
              href="https://redev2.pac-staking.com/"
            >
              REDEV2
            </ActiveLink>
          </div>
          <div className="flex flex-row justify-end gap-4 max-[1200px]:hidden">
            <ConnectButton padding="p-3" />

          </div>
          <div id="burger_open" className="min-[1200px]:hidden">
            <button
              onClick={() => {
                dispatch(setMobBurger())
              }}
              className="yellow_icon_btn"

            >
              <Image src={BurgerOpen} alt="Open burger" />
            </button>
          </div>

        </div>

      </div>



      <div id="mob_menu" className={`${mobBurger ? 'mob_element_open' : 'mob_element_close'}`}>
        <div className="flex flex-col gap-[50px] overflow-auhref">
          <div className="flex justify-between items-start ">
            <ActiveLink href="/" >
              <Image src={Logo} alt="logotype" className="max-w-[120px] max-[600px]:max-w-[95px]" />
            </ActiveLink>
            <button
              onClick={() => {
                dispatch(setMobBurger())
              }}
              className="pl-4 mt-2"
            >
              <Image src={BurgerClose} alt="Close burger" />
            </button>
          </div>
          <div className="flex gap-2 justify-between w-full">
          </div>
          <div className="flex flex-col gap-4 text-white font-orbitron pl-4">
            <ActiveLink href='https://bpacstaking.pw/'  >
              PAC BSC
            </ActiveLink>
            <ActiveLink
              href="/"


            >
              PAC 10000
            </ActiveLink>

            <ActiveLink
              href="https://solopacman.pw/"


            >
              PAC SOLO
            </ActiveLink>

            <ActiveLink
              href="https://octastaking.space/"


            >
              OCTA 200
            </ActiveLink>

            <ActiveLink

              href="https://coinstaking.space/"

            >
              OCTA 1000
            </ActiveLink>

            <ActiveLink
              href="https://redev2.pac-staking.com/"

            >
              REDEV2
            </ActiveLink>

          </div>
        </div>

        <div className="flex flex-row justify-start gap-3">

          <a className="yellow_icon_btn" href="">
            <Image src={tg_ru} alt="telegram ru" />
          </a>
          <a className="yellow_icon_btn" href="">
            <Image src={tg_en} alt="telegram en" />
          </a>
          <a className="yellow_icon_btn" href="">
            <Image src={discord} alt="discord" />
          </a>
          <a className="yellow_icon_btn" href="">
            <Image src={x} alt="social X" />
          </a>

        </div>

      </div>

    </header>

  )
}

export default Header



{/* SOCIAL AND OLD BUThrefN(SPAN) EXIT */ }
{/* <div className="flex flex-row justify-between">
  <div className="flex flex-row align-middle gap-2">
    <a  href="https://discord.gg/JFwaENGDxy">
      <img src={Discord} alt="Discord" />
    </a>
    <a  href="https://t.me/PacmanCoinRU">
      <img src={TelegramRU} alt="TelegramRU" />
    </a>
    <a  href="mailhref:coin.pacman@gmail.com">
      <img src={Mail} alt="Mail" />
    </a>
    <a  href="https://twitter.com/PACMan_hrefken">
      <img src={X} alt="X" />
    </a>
    <a  href="https://t.me/PacmanCoinMain">
      <img src={TelegramEN} alt="TelegramEN" />
    </a>
  </div>
  <span
    onClick={() => {
      handleDisconnect()
      hrefkenService.removeUser()
      navigate("/login")
    }}
    className="text-yellow text-xl cursor-pointer"
  >
  
</div> */}