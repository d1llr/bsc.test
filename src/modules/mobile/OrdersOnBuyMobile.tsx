import { useAccount, useBalance, useNetwork } from "wagmi";

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

const OrdersOnBuy = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { data: userData } = useBalance({
    address: address,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [onBuy, setOnBuy] = useState([] as Order[]);
  const [update, setUpdate] = useState(false as Boolean);
  const [inputAmount, setInputAmount] = useState("" as string);
  const [selectedItem, setSelectedItem] = useState(0 as number);

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
      setOnBuy(await getOrdersOnBuy());
    };

    if (isConnected) {
      fetchData().catch(console.error);
    }
  }, [isConnected, update, userData]);

  function toggleUpdate() {
    setUpdate(!update);
  }

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
    } catch (message) {
      const reason = (message as { message: string })?.message.match(regex);
      return [];
    }
  }

  async function sell(orderId: number, amount: number) {
    const fetchData = async () => {
      const hash = await wagmiWriteContract(
        "Staking",
        "sellTickets",
        [orderId, amount],
        ethers.utils.parseEther("0.001"),
        chain!
      );
      onClose();
      notification(
        `Success!`,
        `Tickets bought. See transaction hash: ${hash}`,
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
      {onBuy.length !== 0 ? (
        <div className="pacman-staking-bsc-mobile-container29">
          <span className="pacman-staking-bsc-text090">Orders On Buy</span>
          {onBuy.map((element, i) => (
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
                      console.log("III: ", i);
                      setSelectedItem(i);
                      onOpen();
                    }}
                  >
                    <span className="pacman-staking-bsc-mobile-text62">
                      <span>Sell</span>
                      <br></br>
                    </span>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ))}
          <Modal isOpen={isOpen} onClose={onClose} size={"s"}>
            <ModalOverlay />
            <ModalContent>
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
                    {onBuy[selectedItem] === undefined
                      ? 0
                      : onBuy[selectedItem].amountOfTickets.toString()}
                  </GridItem>
                  <GridItem colSpan={2}>
                    {"Price per each ticket: "}
                    {onBuy[selectedItem] === undefined
                      ? 0
                      : ethers.utils.formatEther(
                          onBuy[selectedItem].eachTicketPrice
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
                  onClick={() => sell(selectedItem, Number(inputAmount))}
                >
                  Sell
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default OrdersOnBuy;
