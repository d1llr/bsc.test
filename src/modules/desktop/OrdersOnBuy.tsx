import { useAccount, useNetwork } from "wagmi";
import plus from '../../images/icons/plus.svg'

import {
  GridItem,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { wagmiReadContract, wagmiWriteContract } from "@/utils/wagmiCalls";
import { createRef, useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import Image from "next/image";
import { Modal, Popover } from 'flowbite-react';
import BuyRequest from "./BuyRequest";
import { useRouter } from "next/router";

enum OrderType {
  ON_SELL,
  ON_BUY,
}

interface Order {
  orderType: OrderType;
  amountOfTickets: BigNumber;
  eachTicketPrice: BigNumber;
  user: string;
}


const OrdersOnBuy = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const all_user_tickets = useAppSelector(state => state.RedeSlice.all_user_tickets)

  const toast = useToast();

  const [onBuy, setOnBuy] = useState([] as Order[]);
  const [inputAmount, setInputAmount] = useState("" as string);
  const [selectedItem, setSelectedItem] = useState(0 as number);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [currentOrder, setCurrentOrder] = useState<number>()
  const regex = /reason="([^"]+)"/;
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };

  const numberOfTickets = createRef<HTMLInputElement>()
  const ticketCount = createRef<HTMLInputElement>()
  const [error, setError] = useState<string | null>(null)



  function notification(
    title: string,
    message: string,
    status: "info" | "warning" | "success" | "error" | "loading"
  ) {
    toast({
      title,
      description: message,
      status,
      position: "top-right",
      duration: 9000,
      isClosable: true,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setOnBuy(await getOrdersOnBuy());
    };

    if (isConnected) {
      fetchData().catch(console.error);
      const interval = setInterval(() => {
        fetchData().catch(console.error);
      }, 5 * 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  async function getOrdersOnBuy() {
    const fetchData = async () => {
      return (await wagmiReadContract(
        "Staking",
        "getOrdersOnBuy",
        [],
        chain!
      )) as Order[];
    };

    try {
      return await fetchData();
    } catch (e) {
      if (isConnected) {
        const reason = (e as { message: string })?.message.match(regex);
      }
      return [];
    }
  }

  async function sell(orderId: number, amount: number) {
    const fetchData = async () => {
      const hash = new Promise(async (resolve, reject) => {
        await wagmiWriteContract(
          "Staking",
          "sellTickets",
          [orderId, amount],
          ethers.utils.parseEther("0.001"),
          chain!
        ).then(hash => {
          resolve(hash)
        })
          .catch(err => {
            reject(err)
          })
      })
      toast.promise(hash, {
        success: { title: 'Success', description: 'Tickets bought.', position: "top-right", },
        error: { title: 'Error while sell', description: 'Not enough BNB to pay the network fee', position: "top-right", duration: 2000 },
        loading: { title: 'Pending', description: 'Waiting for transaction confirmation...', position: "top-right", },
      })
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
    });
  }

  const Theme = {
    "root": {
      "base": "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      "show": {
        "on": "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
        "off": "hidden"
      },
      "sizes": {
        "sm": "max-w-sm",
        "md": "max-w-md",
        "lg": "max-w-lg",
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl"
      },
      "positions": {
        "top-left": "items-start justify-start",
        "top-center": "items-start justify-center",
        "top-right": "items-start justify-end",
        "center-left": "items-center justify-start",
        "center": "items-center justify-center",
        "center-right": "items-center justify-end",
        "bottom-right": "items-end justify-end",
        "bottom-center": "items-end justify-center",
        "bottom-left": "items-end justify-start"
      }
    },
    "content": {
      "base": "relative h-full w-full p-4 h-auto",
      "inner": "relative rounded-3xl bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]"
    },
    "body": {
      "base": "lg:md:p-6 p-4 pt-0 flex-1 overflow-auto rounded-b-2xl  justify-center",
      "popup": ""
    },
    "header": {
      "base": "flex items-start justify-between rounded-t-2xl dark:border-gray-600 border-b",
      "popup": "lg:md:p-6 p-4 border-b-0 pb-0",
      "title": "mb-5 lg:md:text-[32px] text-2xl font-orbitron  text-yellow font-bold text-center",
      "close": {
        "base": "ml-auto inline-flex items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
        "icon": "h-5 w-5 text-white"
      }
    },
    "footer": {
      "base": "flex items-center space-x-2 rounded-b-2xl border-gray-200 lg:md:p-6 p-4 pt-0 dark:border-gray-600",
      "popup": "border-t"
    }
  }


  async function cancelBuy(orderId: number) {
    const fetchData = async () => {
      const hash = await wagmiWriteContract(
        "Staking",
        "cancelBuy",
        [orderId],
        ethers.utils.parseEther("0"),
        chain!
      );
      notification(
        `Success!`,
        `Buy canceled. See transaction hash: ${hash}`,
        "success"
      );
      setTimeout(() => {
        handleRefresh()
      }, 2000);
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
      notification(
        "Cancel buy error",
        String(reason?.[0] == null ? e : reason?.[0]),
        "error"
      );
    });
  }

  return (
    <>
      <div className={`lg:md:mt-14 sm:mt-10 mt-8 flex flex-col gap-8 `}>
        <div className={`flex lg:md:sm:flex-row flex-col gap-6 justify-between lg:md:sm:items-center mt-20`}>
          <div className="lg:text-8xl md:text-6xl text-[40px] text-yellow font-extrabold font-orbitron">Orders for Buy</div>
          <BuyRequest />
        </div>
        <div className={` lg:md:gap-8 sm:gap-6 gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 `}>
          {onBuy.map((element, i) => (
            <>
              <div key={i} className="w-full bg-lightGray h-full rounded-3xl">
                <div className="lg:md:p-6 p-4 gap-14">
                  <div className="flex flex-col lg:md:gap-8 sm:gap-7 gap-6">
                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between text-white lg:md:text-2xl sm:text-xl text-base font-orbitron font-bold">
                        <ul className="flex flex-col gap-3 w-full">
                          <li className='flex flex-row justify-between items-center mb-3 '>
                            <span className='lg:text-[32px] md:text-[26px] text-[22px] text-yellow'>
                              Order #{i + 1}
                            </span>
                            <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                            </span>
                          </li>
                          <li className='flex flex-row justify-between items-center'>
                            <span className='lg:text-[32px] md:text-[26px] text-[22px] text-white'>
                              Quantity
                            </span>
                            <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                              {element.amountOfTickets.toString()}
                            </span>
                          </li>
                          <li className='flex flex-row justify-between items-center'>
                            <span className='lg:text-[32px] md:text-[26px] text-[22px] text-white'>
                              Price
                            </span>
                            <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                              {ethers.utils.formatEther(element.eachTicketPrice)}
                            </span>
                          </li>
                        </ul>

                      </div>
                    </div>
                    {
                      element.user == address ?
                        <button className="text-lg lg:md:mt-5 sm:mt-1 mt-0 text-yellow font-orbitron font-semibold bg-black rounded-3xl px-6 py-3 12 disabled:text-white disabled:opacity-40"
                          onClick={() => {
                            cancelBuy(i)
                          }}
                        >

                          Cancel
                        </button>
                        :
                        <button className="text-lg lg:md:mt-5 sm:mt-1 mt-0 text-yellow font-orbitron font-semibold bg-black rounded-3xl px-6 py-3 12 disabled:text-white disabled:opacity-40"
                          onClick={() => {
                            sell(i, 1)
                            setCurrentOrder(i);
                          }}
                          disabled={all_user_tickets ? false : true}
                        >

                          Sell
                        </button>
                    }
                  </div>
                </div>
              </div >

            </>
          ))}

        </div >
      </div >
    </>


  );
};

export default OrdersOnBuy;
