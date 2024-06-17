import { useAccount, useNetwork } from "wagmi";

import { useToast } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { wagmiReadContract, wagmiWriteContract } from "@/utils/wagmiCalls";
import { useEffect, useState } from "react";

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

const CanselPurchaiseMobile = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();

  const [onBuy, setOnBuy] = useState([] as Order[]);
  const [onSell, setOnSell] = useState([] as Order[]);
  const [update, setUpdate] = useState(false as Boolean);

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
      setOnBuy(await getTicketsOnBuy());
      setOnSell(await getTicketsOnSell());
    };

    if (isConnected) {
      fetchData().catch(console.error);
    }
  }, [isConnected, update]);

  function toggleUpdate() {
    setUpdate(!update);
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
      return await fetchData();
    } catch (message) {
      const reason = (message as { message: string })?.message.match(regex);
      return [];
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
      return [];
    }
  }

  async function cancelSell(orderId: number) {
    console.log("(cancelSell) order id: ", orderId);
    const fetchData = async () => {
      const hash = await wagmiWriteContract(
        "Staking",
        "cancelSell",
        [orderId],
        ethers.utils.parseEther("0"),
        chain!
      );
      notification(
        `Success!`,
        `Sell canceled. See transaction hash: ${hash}`,
        "success"
      );
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
    });

    toggleUpdate();
  }

  async function cancelBuy(orderId: number) {
    console.log("(cancelBuy) order id: ", orderId);
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
    };

    fetchData().catch((e: Error) => {
      const reason = (e as { message: string })?.message.match(regex);
    });

    toggleUpdate();
  }

  return (
    <>
      {onBuy.length + onSell.length !== 0 ? (
        <div className="pacman-staking-bsc-mobile-container08">
          <span className="pacman-staking-bsc-mobile-text18">
            Cancel purchase
          </span>
          {onBuy.map((element, i) => (
            <>
              {element.user === address ? (
                <div className="pacman-staking-bsc-mobile-container09">
                  <div className="pacman-staking-bsc-mobile-container10">
                    <div className="pacman-staking-bsc-mobile-container11">
                      <span className="pacman-staking-bsc-mobile-text19">
                        Operation
                      </span>
                      <span className="pacman-staking-bsc-mobile-text20">
                        {element.orderType == 0 ? "Sell" : "Buy"}
                      </span>
                    </div>
                    <div className="pacman-staking-bsc-mobile-container12">
                      <span className="pacman-staking-bsc-mobile-text21">
                        Quantity
                      </span>
                      <span className="pacman-staking-bsc-mobile-text22">
                        {element.amountOfTickets.toString()}
                      </span>
                    </div>
                    <div className="pacman-staking-bsc-mobile-container13">
                      <span className="pacman-staking-bsc-mobile-text23">
                        Price
                      </span>
                      <span className="pacman-staking-bsc-mobile-text24">
                        {ethers.utils.formatEther(element.eachTicketPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="pacman-staking-bsc-mobile-button1 button"
                    onClick={() => cancelBuy(i)}
                  >
                    <span className="pacman-staking-bsc-mobile-text25">
                      <span>Cancel</span>
                      <br></br>
                    </span>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ))}
          {onSell.map((element, i) => (
            <>
              {element.user === address ? (
                <div className="pacman-staking-bsc-mobile-container09">
                  <div className="pacman-staking-bsc-mobile-container10">
                    <div className="pacman-staking-bsc-mobile-container11">
                      <span className="pacman-staking-bsc-mobile-text19">
                        Operation
                      </span>
                      <span className="pacman-staking-bsc-mobile-text20">
                        {element.orderType == 0 ? "Sell" : "Buy"}
                      </span>
                    </div>
                    <div className="pacman-staking-bsc-mobile-container12">
                      <span className="pacman-staking-bsc-mobile-text21">
                        Quantity
                      </span>
                      <span className="pacman-staking-bsc-mobile-text22">
                        {element.amountOfTickets.toString()}
                      </span>
                    </div>
                    <div className="pacman-staking-bsc-mobile-container13">
                      <span className="pacman-staking-bsc-mobile-text23">
                        Price
                      </span>
                      <span className="pacman-staking-bsc-mobile-text24">
                        {ethers.utils.formatEther(element.eachTicketPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="pacman-staking-bsc-mobile-button1 button"
                    onClick={() => cancelSell(i)}
                  >
                    <span className="pacman-staking-bsc-mobile-text25">
                      <span>Cancel</span>
                      <br></br>
                    </span>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default CanselPurchaiseMobile;
