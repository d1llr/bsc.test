import { useAccount, useNetwork } from "wagmi";

import {
  GridItem,
  Input,
  Modal,
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
import {
  approveERC20,
  wagmiReadContract,
  wagmiWriteContract,
} from "@/utils/wagmiCalls";
import { useEffect, useState } from "react";
import { getAddress } from "@/utils/contracts";

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

const OrdersOnSellMobile = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();

  const [onSell, setOnSell] = useState([] as Order[]);
  const [inputAmount, setInputAmount] = useState("" as string);
  const [selectedItem, setSelectedItem] = useState(0 as number);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      fetchData().catch(console.error);
    }
  }, [isConnected, address]);

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

  async function buy(orderId: number, amount: number) {
    const fetchData = async () => {
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
          `Your balance: ${
            splitedBalance[0] + "." + splitedBalance[1].slice(0, 2)
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
      );

      notification(
        `Success!`,
        `Tickets bought. See transaction hash: ${hash}`,
        "success"
      );
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

  return (
    <>
      {onSell.length !== 0 ? (
        <>
          <div className="pacman-staking-bsc-mobile-container29">
            <span className="pacman-staking-bsc-mobile-text55">
              Orders on Sell
            </span>
            {onSell.map((element, i) => (
              <>
                {element.user !== address ? (
                  <div className="pacman-staking-bsc-mobile-container30">
                    <div className="pacman-staking-bsc-mobile-container31">
                      <div className="pacman-staking-bsc-mobile-container32">
                        <span className="pacman-staking-bsc-mobile-text56">
                          Operation
                        </span>
                        <span className="pacman-staking-bsc-mobile-text57">
                          {element.orderType == 0 ? "Sell" : "Buy"}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-mobile-container33">
                        <span className="pacman-staking-bsc-mobile-text58">
                          Quantity
                        </span>
                        <span className="pacman-staking-bsc-mobile-text59">
                          {element.amountOfTickets.toString()}
                        </span>
                      </div>
                      <div className="pacman-staking-bsc-mobile-container34">
                        <span className="pacman-staking-bsc-mobile-text60">
                          Price (PAC)
                        </span>
                        <span className="pacman-staking-bsc-mobile-text61">
                          {ethers.utils.formatEther(element.eachTicketPrice)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="pacman-staking-bsc-mobile-button5 button"
                      onClick={() => {
                        setSelectedItem(i);
                        onOpen();
                      }}
                    >
                      <span className="pacman-staking-bsc-mobile-text62">
                        <span>Buy</span>
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

          <Modal isOpen={isOpen} onClose={onClose} size={"m"}>
            <ModalOverlay margin={30} />
            <ModalContent margin={30}>
              <ModalHeader>Indicate quantity of tickets to buy</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  padding={2.5}
                  borderRadius="xl"
                  marginTop={20}
                >
                  <GridItem colSpan={2}>
                    Max to buy:{" "}
                    {onSell[selectedItem] === undefined
                      ? 0
                      : onSell[selectedItem].amountOfTickets.toString()}
                  </GridItem>
                  <GridItem colSpan={2}>
                    {"Price per each ticket: "}
                    {onSell[selectedItem] === undefined
                      ? 0
                      : ethers.utils.formatEther(
                          onSell[selectedItem].eachTicketPrice
                        )}
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      variant="flushed"
                      placeholder="Enter amount of tickets..."
                      value={inputAmount}
                      onChange={(e: any) => setInputAmount(e.target.value)}
                    />
                  </GridItem>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter>
                <button
                  type="button"
                  className="pacman-staking-bsc-button06 button"
                  onClick={() => buy(selectedItem, Number(inputAmount))}
                >
                  Buy
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default OrdersOnSellMobile;
