import { useAccount, useNetwork } from "wagmi";

import { getEllipsisTxt } from "@/utils/format";
import { supportedChain } from "@/modules/Chains/chains";
import { useToast, useClipboard, Popover, Circle } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { wagmiReadContract } from "@/utils/wagmiCalls";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setAllUserTickets, setUserOrders } from "@/app/slices/Rede.slice";

interface UserStats {
  ownedTicketsAmount: BigNumber;
  onSell: BigNumber;
  onBuy: BigNumber;
}

enum OrderType {
  ON_SELL,
  ON_BUY,
}

export interface Order {
  index: number;
  orderType: OrderType;
  amountOfTickets: BigNumber;
  eachTicketPrice: BigNumber;
  user: string;
}

const UserStatistics = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const dispatch = useAppDispatch()
  const { onCopy } = useClipboard(address!);
  const toast = useToast();

  const regex = /reason="([^"]+)"/;

  const [yourTicketsAmount, setYourTicketsAmount] = useState(BigNumber.from(0));
  const [lenOnBuy, setLenOnBuy] = useState("0" as String);
  const [lenOnSell, setLenOnSell] = useState("0" as String);

  useEffect(() => {
    const fetchData = async () => {
      const userTickets = await getTicketsAmount();
      const ticketsOnBuy = await getTicketsOnBuy();
      const ticketsOnSell = await getTicketsOnSell();

      dispatch(setAllUserTickets(Number(userTickets)))
      setYourTicketsAmount(userTickets);
      setLenOnBuy(
        String(
          (ticketsOnBuy as Order[]).reduce(
            (acc: BigNumber, order: Order) =>
              order.user === address ? acc : acc.add(order.amountOfTickets),
            BigNumber.from(0)
          )
        )
      );
      setLenOnSell(
        String(
          (ticketsOnSell as Order[]).reduce(
            (acc: BigNumber, order: Order) =>
              order.user === address ? acc : acc.add(order.amountOfTickets),
            BigNumber.from(0)
          )
        )
      );
    };

    if (isConnected) {
      fetchData().catch(console.error);
      const interval = setInterval(() => {
        fetchData().catch(console.error);
      }, 5 * 1000);
      return () => clearInterval(interval);
    } else {
      setLenOnBuy("0");
      setLenOnSell("0");
      setYourTicketsAmount(BigNumber.from(0));
    }
  }, [isConnected, address]);

  function copy() {
    onCopy();
    toast({
      title: "Copppied!",
      status: "success",
      position: "top",
      isClosable: true,
    });
  }

  async function getTicketsAmount() {
    const fetchData = async () => {
      console.log(
        JSON.stringify(
          (await wagmiReadContract(
            "Staking",
            "getUser",
            [address],
            chain!
          )) as UserStats
        )
      );
      return (
        (await wagmiReadContract(
          "Staking",
          "getUser",
          [address],
          chain!
        )) as UserStats
      ).ownedTicketsAmount;
    };

    try {
      return await fetchData();
    } catch (message) {
      const reason = (message as { message: string })?.message.match(regex);
      return BigNumber.from(0);
    }
  }

  async function getTicketsOnBuy() {
    const fetchData = async () => {
      return (await wagmiReadContract(
        "Staking",
        "getOrdersOnBuy",
        [],
        chain!
      )) as Order[];
    };

    try {
      console.log(await fetchData());

      return await fetchData();
    } catch (message) {
      console.log(message);

      const reason = (message as { message: string })?.message.match(regex);
      return 0;
    }
  }

  async function getTicketsOnSell() {
    const fetchData = async () => {
      return (await wagmiReadContract(
        "Staking",
        "getOrdersOnSell",
        [],
        chain!
      )) as Order[];
    };

    try {
      return await fetchData();
    } catch (message) {
      const reason = (message as { message: string })?.message.match(regex);
      return 0;
    }
  }

  return (

    <div className="flex flex-col lg:md:gap-12 gap-8 justify-between ">

      <div className="lg:md:my-20 sm:my-10 ">
        <div className=" flex lg:md:flex-row flex-col lg:md:gap-36 gap-8 justify-between">
          <div className="flex flex-col lg:md:gap-8 gap-4">
            <div className="flex flex-row lg:text-2xl md:text-xl sm:text-lg text-base text-white font-orbitron font-bold">Available tickets for sale</div>
            <div className="flex flex-row lg:text-[56px] md:text-48px] sm:text-[43px] text-[38px] leading-10 text-yellow font-orbitron font-extrabold">{lenOnSell} tickets</div>
          </div>
          <div className="flex flex-col lg:md:gap-8 gap-4">
            <div className="flex flex-row lg:text-2xl md:text-xl sm:text-lg text-base text-white font-orbitron font-bold">Available tickets for purchase</div>
            <div className="flex flex-row lg:text-[56px] md:text-48px] sm:text-[43px] text-[38px] leading-10 text-yellow font-orbitron font-extrabold">{lenOnBuy} tickets</div>
          </div>
          <div className="flex flex-col lg:md:gap-8 gap-4">
            <div className="flex flex-row lg:text-2xl md:text-xl sm:text-lg text-base text-white font-orbitron font-bold">Your tickets at all</div>
            <div className="flex flex-row lg:text-[56px] md:text-48px] sm:text-[43px] text-[38px] leading-10 text-yellow font-orbitron font-extrabold">{Number(yourTicketsAmount)} tickets</div>
          </div>
        </div>

        {/* <div className={`lg:md:mt-14 sm:mt-10 mt-8 flex flex-col gap-8 `}>
          <div className='flex flex-col justify-between lg:gap-8 md:gap-6 sm:gap-4 gap-3'>
            <div className='flex flex-row justify-between gap-4 max-[1300px]:flex-col max-[1300px]:w-full max-[1300px]:bg-lightGray max-[1300px]:p-3 max-[1300px]:rounded-2xl'>
              <div className='flex lg:md:flex-row flex-col w-1/2 max-[1300px]:w-full justify-between lg:md:items-center  bg-lightGray lg:p-8  p-0 rounded-2xl'>
                <span className='lg:text-[32px] md:text-[26px] text-[22px] text-yellow'>
                  Node #{Number('123')}
                </span>
                <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                </span>
              </div>
              <div className='flex flex-row lg:md:gap-4 sm:gap-3 gap-2 max-[1300px]:w-full w-1/2 '>
                <div className='flex flex-row relative font-orbitron w-full'>
                  <button disabled={true} className='w-full disabled:opacity-50 lg:md:bg-lightGray bg-lightGrayHover py-4 px-4 font-orbitron text-white lg:text-3xl md:text-xl sm:text-base text-sm rounded-2xl transition duration-150 ease-out hover:ease-in'>
                    Disconnect
                  </button>

                </div>
                {
                  <div className='flex flex-row relative font-orbitron w-full'>
                    <button disabled={true} className='w-full disabled:opacity-50 lg:md:bg-lightGray bg-lightGrayHover px-4 font-orbitron text-white lg:text-3xl md:text-xl sm:text-base text-sm rounded-2xl transition duration-150 ease-out hover:ease-in'>
                      Claim reward
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserStatistics;
