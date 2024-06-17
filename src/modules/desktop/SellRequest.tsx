import { useAccount, useNetwork } from "wagmi";
import { wagmiReadContract, wagmiWriteContract } from "@/utils/wagmiCalls";
import { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import plus from '../../images/icons/plus.svg'
import { useToast } from "@chakra-ui/react";
import { useAppSelector } from "@/app/hooks";
import Image from "next/image";
import { Modal } from "flowbite-react";
import { useRouter } from "next/router";
import { Order } from "./UserStats";

const SellTickets = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();
  const numberOfTickets = createRef<HTMLInputElement>()
  const ticketPrice = createRef<HTMLInputElement>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };
  const regex = /reason="([^"]+)"/;

  const [onSell, setOnSell] = useState([] as Order[]);

  useEffect(() => {
    const fetchData = async () => {
      setOnSell(await getTicketsOnSell());
    };

    if (isConnected) {
      fetchData().catch(console.error);
      const interval = setInterval(() => {
        fetchData().catch(console.error);
      }, 5 * 1000);
      return () => clearInterval(interval);
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


  var ticketsOnSell
  (async () => {
    ticketsOnSell = await getTicketsOnSell() as Order[];
  })


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

  async function setOrderOnSell(tickets: string, price: string) {
    const fetchData = async () => {
      const hash = await wagmiWriteContract(
        "Staking",
        "setOrderOnSell",
        [Number(tickets), ethers.utils.parseEther(price)],
        ethers.utils.parseEther("0.001"),
        chain!
      );
      notification(
        `Success!`,
        `Order on sell set. See transaction hash: ${hash}`,
        "success"
      );
    };

    if (isConnected && price !== "" && tickets !== "") {
      fetchData().catch((e: Error) => {
        const reason = (e as { message: string })?.message.match(regex);
        notification(
          "Error (set order on sell)",
          String(reason?.[0] == null ? e : reason?.[0]),
          "error"
        );
      });
    } else {
      notification("Error!", "Check your connection or parameters", "error");
    }
  }

  async function cancelSell(orderId: number) {
    const fetchData = async () => {
      notification(
        `Penging`,
        `Waiting for transaction confirmation...`,
        "loading"
      );
      const hash = await wagmiWriteContract(
        "Staking",
        "cancelSell",
        [orderId],
        ethers.utils.parseEther("0"),
        chain!
      ).then((hash ) => {
        notification(
          `Success!`,
          `Sell canceled. See transaction hash: ${hash}`,
          "success"
        );
      })
      setTimeout(() => {
        handleRefresh()
      }, 2000);
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
      notification(
        "Cancel sell error",
        String(reason?.[0] == null ? e : reason?.[0]),
        "error"
      );
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
      "base": "lg:md:p-6 p-4 lg:px-8 pt-0 flex-1 overflow-auto rounded-b-2xl justify-center",
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
  return (
    <>
      <div className={`lg:md:mt-14 sm:mt-10 mt-8 flex flex-col gap-8 `}>
        <div className={`flex lg:md:sm:flex-row flex-col gap-6 justify-between lg:md:sm:items-center mt-20`}>
          <div className="lg:text-8xl md:text-6xl text-[40px] text-yellow font-extrabold font-orbitron">My sell orders</div>

          <div className="flex flex-col gap-2 lg:md:self-center self-end items-end">
            <button className='yellow_btn flex flex-row items-center py-3 px-4 text-base rounded-2xl gap-3' onClick={() => setOpenModal(true)}>
              Create a sell order
              <Image src={plus} alt="" />
            </button>
          </div>
        </div>
        {
          onSell.length != 0 ?
            <div className={`lg:md:mt-14 sm:mt-10 mt-8 lg:md:gap-8 sm:gap-6 gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 `}>
              {(onSell as Order[])?.map((element, i) =>
                element.user == address &&
                (
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
                                  {/* <span className='font-orbitron lg:text-2xl md:text-xl text-base text-white'>
                              {Number(ethers.utils.formatEther(element.eachTicketPrice)) > normalPrice ? '' : ''}
                            </span> */}
                                </li>


                              </ul>

                            </div>
                          </div>
                          <button className="text-lg lg:md:mt-5 sm:mt-1 mt-0 text-yellow font-orbitron font-semibold bg-black rounded-3xl px-6 py-3 12" onClick={() => {
                            console.log('user_adress: ', address);
                            console.log('order_address: ', element.user);
                            console.log('order_index: ', i);
                            cancelSell(i)
                          }}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </>
                ))}

            </div >
            :
            <div className="bg-lightGray rounded-[30px] flex flex-col items-center gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
              <div className="flex flex-col items-center gap-5">
                <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                  You don't have any placed orders yet
                </div>
                <div className="flex flex-col gap-2">
                  <button className='yellow_btn flex flex-row items-center py-3 px-4 text-base rounded-2xl gap-3' onClick={() => setOpenModal(true)}>
                    Create a sell order
                    <Image src={plus} alt="" />
                  </button>
                </div>
              </div>
            </div>
        }
      </div>
      <Modal show={openModal} theme={Theme} size="lg" onClose={() => setOpenModal(false)} popup className='bg-black opacity-1 bg-opacity-1 rounded-2xl'>
        <Modal.Header className='bg-lightGray'>
          Sell tickets
        </Modal.Header>
        <Modal.Body className='bg-lightGray'>
          <div className="text-center text-white">
            <div className="flex flex-col justify-between text-white gap-5 text-2xl w-full font-orbitron font-bold">
              <ul className="flex flex-col gap-6 w-full">
                <li className='flex flex-col items-start justify-between gap-1'>
                  <label className="text-2xl  after:text-yellow after:font-beausans max-[600px]:text-lg">
                    Number of tickets for sale
                  </label>
                  <input
                    type="text"
                    className={`form-control w-full focus:outline-0 focus:border-white focus:ring-transparent ${error ? 'border-red-500' : "border-white"} border-0 outline-none ring-0 border-b-2 font-normal text-[22px] bg-lightGray p-0 py-2 font-chakra max-[600px]:text-sm`}
                    placeholder="Enter amount of tickets"
                    ref={numberOfTickets}
                  />
                </li>
                <li className='flex flex-col justify-between items-start gap-1'>
                  <label className="text-2xl after:inline after:text-yellow after:font-beausans max-[600px]:text-lg">
                    Ticket price
                  </label>
                  <input
                    type="text"
                    className={`form-control w-full focus:outline-0 focus:border-white focus:ring-transparent ${error ? 'border-red-500' : "border-white"} border-0 outline-none ring-0 border-b-2 font-normal text-[22px] bg-lightGray p-0 py-2 font-chakra max-[600px]:text-sm`}
                    placeholder="Enter the ticket price"
                    ref={ticketPrice}
                  />
                </li>
                <li className='flex flex-row gap-2 justify-between'>
                  <button className="text-lg w-full lg:md:mt-5 sm:mt-1 mt-0 text-white font-orbitron font-semibold bg-black hover:bg-customBlackHover rounded-2xl px-6 py-3 " onClick={() => {
                    setOrderOnSell(numberOfTickets?.current?.value as string, ticketPrice?.current?.value as string)
                  }}>
                    Sell tickets
                  </button>

                  <button className="text-lg w-full lg:md:mt-5 sm:mt-1 mt-0 text-black font-orbitron font-semibold bg-[#898989] hover:bg-lightGrayHover rounded-2xl px-6 py-3" onClick={() => setOpenModal(false)}>
                    Cancel
                  </button>
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
    </>
  );
};

export default SellTickets;
