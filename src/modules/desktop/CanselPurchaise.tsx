import { useAccount, useNetwork } from "wagmi";

import { wagmiReadContract, wagmiWriteContract } from "@/utils/wagmiCalls";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

import { GridItem, SimpleGrid, useToast } from "@chakra-ui/react";

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

const CanselPurchaise = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();

  const [onBuy, setOnBuy] = useState([] as Order[]);
  const [onSell, setOnSell] = useState([] as Order[]);

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
      const interval = setInterval(() => {
        fetchData().catch(console.error);
      }, 5 * 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

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
    } catch (e) {
      if (isConnected) {
        const reason = (e as { message: string })?.message.match(regex);
      }
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
    } catch (e) {
      if (isConnected) {
        const reason = (e as { message: string })?.message.match(regex);
      }
      return [];
    }
  }

  async function cancelSell(orderId: number) {
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
      notification(
        "Cancel sell error",
        String(reason?.[0] == null ? e : reason?.[0]),
        "error"
      );
    });
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
      {onBuy.length + onSell.length !== 0 ? (
        <div className="pacman-staking-bsc-container014">
          <span className="pacman-staking-bsc-text012">Cancel purchase</span>
          {onBuy.length !== 0 ? (
            <SimpleGrid
              columns={3}
              spacing={4}
              padding={2.5}
              justifyContent={"center"}
              alignContent={"center"}
              display={"flex"}
              flexWrap={"wrap"}
            >
              {onBuy.map((element, i) =>
                element.user === address ? (
                  <GridItem
                    colSpan={2}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div
                      className="pacman-staking-bsc-container016"
                      style={{ margin: "0" }}
                    >
                      <div className="pacman-staking-bsc-container017">
                        <span className="pacman-staking-bsc-text013">
                          Operation
                        </span>
                        <span className="pacman-staking-bsc-text014">
                          {element.orderType == 0 ? "Sell" : "Buy"}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-container018">
                        <span className="pacman-staking-bsc-text015">
                          Quantity
                        </span>
                        <span className="pacman-staking-bsc-text016">
                          {element.amountOfTickets.toString()}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-container019">
                        <span className="pacman-staking-bsc-text017">
                          Price (PAC)
                        </span>
                        <span className="pacman-staking-bsc-text018">
                          {ethers.utils.formatEther(element.eachTicketPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="pacman-staking-bsc-button button"
                        onClick={() => cancelBuy(i)}
                      >
                        Cancel
                      </button>
                    </div>
                  </GridItem>
                ) : (
                  <></>
                )
              )}
            </SimpleGrid>
          ) : (
            ""
          )}
          {onSell.length !== 0 ? (
            <SimpleGrid
              columns={3}
              spacing={4}
              padding={2.5}
              justifyContent={"center"}
              alignContent={"center"}
              display={"flex"}
              flexWrap={"wrap"}
            >
              {onSell.map((element, i) =>
                element.user === address ? (
                  <GridItem
                    colSpan={2}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="pacman-staking-bsc-container016">
                      <div className="pacman-staking-bsc-container017">
                        <span className="pacman-staking-bsc-text013">
                          Operation
                        </span>
                        <span className="pacman-staking-bsc-text014">
                          {element.orderType == 0 ? "Sell" : "Buy"}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-container018">
                        <span className="pacman-staking-bsc-text015">
                          Quantity
                        </span>
                        <span className="pacman-staking-bsc-text016">
                          {element.amountOfTickets.toString()}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-container019">
                        <span className="pacman-staking-bsc-text017">
                          Price (PAC)
                        </span>
                        <span className="pacman-staking-bsc-text018">
                          {ethers.utils.formatEther(element.eachTicketPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="pacman-staking-bsc-button button"
                        onClick={() => cancelSell(i)}
                      >
                        Cancel
                      </button>
                    </div>
                  </GridItem>
                ) : (
                  <></>
                )
              )}
            </SimpleGrid>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default CanselPurchaise;
