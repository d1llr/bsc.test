import { useAccount, useNetwork } from "wagmi";

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
import { Modal, Popover } from 'flowbite-react';
import { BigNumber, ethers } from "ethers";
import {
  approveERC20,
  wagmiReadContract,
  wagmiWriteContract,
} from "@/utils/wagmiCalls";
import { LegacyRef, createRef, useEffect, useRef, useState } from "react";
import { getAddress } from "@/utils/contracts";
import { useAppSelector } from "@/app/hooks";
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

const OrdersOnSell = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const all_user_tickets = useAppSelector(state => state.RedeSlice.all_user_tickets)
  const toast = useToast();
  const inputRef = createRef<HTMLInputElement>()
  const [error, setError] = useState<string | null>(null)
  const [onSell, setOnSell] = useState([] as Order[]);
  const [inputAmount, setInputAmount] = useState("" as string);
  const [selectedItem, setSelectedItem] = useState(0 as number);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };
  const regex = /reason="([^"]+)"/;

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
      setOnSell(await getTicketsOnSell());
    };

    if (isConnected) {
      fetchData().catch((e: Error) => {
        const reason = (e as { message: string })?.message.match(regex);
        notification(
          "Buing error",
          String(reason?.[0] == null ? e : reason?.[0]),
          "error"
        );
      });
    }
  }, [isConnected]);

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
    } catch (e) {
      if (isConnected) {
        const reason = (e as { message: string })?.message.match(regex);
      }
      return [];
    }
  }

  async function buy(orderId: number, amount: number) {
    const fetchData = async () => {
      notification(
        `Penging`,
        `Waiting for transaction confirmation...`,
        "loading"
      );
      const [balance, allowance] = await Promise.all([
        wagmiReadContract("PAC", "balanceOf", [address], chain!),
        wagmiReadContract(
          "PAC",
          "allowance",
          [address, getAddress("Staking", chain!.id)],
          chain!
        ),
      ]);

      console.log("My balance: ", ethers.utils.formatEther(balance));
      console.log("My allowance: ", ethers.utils.formatEther(allowance));

      if (
        Number(ethers.utils.formatEther(balance)) <
        Number(
          ethers.utils.formatEther(onSell[orderId].eachTicketPrice.mul(amount))
        )
      ) {
        const splitedBalance = ethers.utils
          .formatEther(balance)
          .toString()
          .split(".");

        notification(
          "Pay Attention!",
          `Your balance: ${splitedBalance[0] + "." + splitedBalance[1].slice(0, 2)
          }
          You trying to spend: ${ethers.utils.formatEther(
            onSell[orderId].eachTicketPrice.mul(amount)
          )}`,
          "warning"
        );

        return;
      }

      if (
        Number(ethers.utils.formatEther(allowance)) <
        Number(
          ethers.utils.formatEther(onSell[orderId].eachTicketPrice.mul(amount))
        )
      ) {
        await approveERC20(
          "Staking",
          onSell[orderId].eachTicketPrice.mul(amount),
          chain!
        );
      }

      const hash = await wagmiWriteContract(
        "Staking",
        "buyTickets",
        [orderId, amount],
        ethers.utils.parseEther("0"),
        chain!
      ).then((hash) => {
        notification(
          `Success!`,
          `Tickets bought. See transaction hash: ${hash}`,
          "success"
        );

      })

      setTimeout(() => {
        handleRefresh()
      }, 2000);
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
      console.log(e);
      notification(
        "Error while buy",
        String(reason?.[0] == null ? e : reason?.[0]),
        "error"
      );
    });
  }
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [currentOrder, setCurrentOrder] = useState<number | null>(null)
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
      "base": "lg:md:p-6 p-4 pt-0 flex-1 overflow-auto rounded-b-2xl justify-center",
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
  const normalPrice = 5000
  return (
    <>
      <div className={` flex flex-col gap-8 `}>
        <div className="lg:text-8xl md:text-6xl text-[40px] text-yellow font-extrabold font-orbitron">Buy tickets</div>
        <div className={` lg:md:gap-8 sm:gap-6 gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 `}>
          {onSell.map((element, i) => (
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
                            {Number(ethers.utils.formatEther(element.eachTicketPrice)) > normalPrice ?
                              <span className='font-orbitron lg:text-2xl md:text-xl text-base text-red-500'>
                                {ethers.utils.formatEther(element.eachTicketPrice)}
                              </span>
                              :
                              <span className='font-orbitron lg:text-2xl md:text-xl text-base text-green-500'>
                                {ethers.utils.formatEther(element.eachTicketPrice)}
                              </span>}
                            {/* <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                              {Number(ethers.utils.formatEther(element.eachTicketPrice)) > normalPrice ? '' : ''}
                            </span> */}
                          </li>
                        </ul>

                      </div>
                    </div>
                    <button className="text-lg lg:md:mt-5 sm:mt-1 mt-0 text-yellow font-orbitron font-semibold bg-black rounded-3xl px-6 py-3 " onClick={() => {
                      setCurrentOrder(i);
                      console.log('clicked');
                      console.log(currentOrder);

                      setOpenModal(true);
                    }}>Buy</button>
                  </div>
                </div>
              </div>

            </>
          ))}

        </div >
        {currentOrder != null &&
          <Modal show={openModal} theme={Theme} size="md" onClose={() => setOpenModal(false)} popup className='bg-black opacity-1 bg-opacity-1 rounded-2xl'>
            <Modal.Header className='bg-lightGray'>
              Order #{currentOrder! + 1}
            </Modal.Header>
            <Modal.Body className='bg-lightGray'>
              <div className="text-center text-white">
                <div className="flex flex-col justify-between text-white gap-5 text-2xl w-full font-orbitron font-bold">
                  <ul className="flex flex-col gap-4 w-full">
                    <li className='flex flex-row justify-between w-full'>
                      <span className='lg:md:text-2xl sm:text-xl text-base'>
                        Max to buy
                      </span>
                      <span className='lg:md:text-2xl sm:text-lg text-sm'>
                        {onSell[currentOrder!].amountOfTickets.toString()}
                      </span>
                    </li>
                    <li className='flex flex-row justify-between'>
                      <span className='lg:md:text-2xl sm:text-xl text-base'>
                        Price per ticket
                      </span>
                      {Number(ethers.utils.formatEther(onSell[currentOrder].eachTicketPrice)) > normalPrice ?
                        <span className='font-orbitron lg:text-2xl md:text-xl text-base text-red-500'>
                          {ethers.utils.formatEther(onSell[currentOrder].eachTicketPrice)}
                        </span>
                        :
                        <span className='font-orbitron lg:text-2xl md:text-xl text-base text-green-500'>
                          {ethers.utils.formatEther(onSell[currentOrder].eachTicketPrice)}
                        </span>}
                    </li>
                    <li className='flex flex-col justify-between'>
                      <input
                        type="text"
                        className={`form-control focus:outline-0 focus:border-white focus:ring-transparent ${error ? 'border-red-500' : "border-white"} border-0 outline-none ring-0 border-b-2 font-normal text-[22px] bg-lightGray p-0 py-1 font-chakra max-[600px]:text-sm`}
                        placeholder="Enter amount of tickets"
                        ref={inputRef}
                      />
                    </li>
                    <li className='flex flex-col justify-between'>
                      <span className="text-xl font-normal text-center">
                        The reward for a ticket is fixed and is not dependent on the ticket's price.
                      </span>
                    </li>
                    <li className='flex flex-col justify-between'>
                      <button className="text-lg lg:md:mt-5 sm:mt-1 mt-0 text-white font-orbitron font-semibold bg-black rounded-3xl px-6 py-3 " onClick={() => {
                        if (Number(inputRef?.current?.value) > 0 && onSell[currentOrder].amountOfTickets.toNumber() >= Number(inputRef?.current?.value)) {
                          setError(null)
                          buy(currentOrder, Number(inputRef?.current?.value))
                        }
                        else {
                          setError('Error')
                        }
                      }}>Buy</button>
                    </li>
                    {/* <li className='flex flex-row gap-3'>
                      {
                        buyLoading ?
                          <button
                            type='submit'
                            className={`text-white 'button_loading'} w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base disabled:opacity-30`}
                            disabled={currentPool.available_tickets == 0 ? true : false}
                          >
                            <ButtonLoading />
                          </button>

                          :
                          <button
                            type='submit'
                            className={`text-white 'button_loading'} w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base disabled:opacity-30`}
                            onClick={() => handleBuy(currentPool)}
                          >
                            Buy
                          </button>
                      }
                      {
                        sellLoading ?
                          <button
                            type='submit'
                            className={`text-white 'button_loading'} w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base disabled:opacity-30`}
                            disabled={currentPool.user_tickets == 0 ? true : false}
                          >
                            <ButtonLoading />
                          </button>
                          :
                          <button
                            className={`text-base text-black w-1/2 bg-[#898989] hover:bg-lightGrayHover p-3 rounded-xl disabled:opacity-30`}
                            onClick={() => handleSell(currentPool)}
                            disabled={currentPool.user_tickets == 0 ? true : false}
                          >
                            Sell
                          </button>
                      }
                    </li> */}
                  </ul>

                </div>
              </div>
            </Modal.Body>

          </Modal>
        }
      </div >
    </>
  );
};

export default OrdersOnSell;
