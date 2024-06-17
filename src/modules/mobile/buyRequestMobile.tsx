import { useAccount, useNetwork } from "wagmi";

import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { approveERC20, wagmiWriteContract } from "@/utils/wagmiCalls";
import { useState } from "react";

const BuyRequestMobile = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();

  const [tickets, setTickets] = useState("" as string);
  const [price, setPrice] = useState("" as string);

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

  async function setOrderOnBuy() {
    const fetchData = async () => {
      console.log(
        await approveERC20(
          "Staking",
          ethers.utils.parseEther(price).mul(Number(tickets)),
          chain!
        )
      );

      const hash = await wagmiWriteContract(
        "Staking",
        "setOrderOnBuy",
        [Number(tickets), ethers.utils.parseEther(price)],
        ethers.utils.parseEther("0"),
        chain!
      );
      notification(
        `Success!`,
        `Order on buy set. See transaction hash: ${hash}`,
        "success"
      );
    };

    if (isConnected && price !== "" && tickets !== "") {
      fetchData().catch((e: Error) => {
        const reason = (e as { message: string })?.message.match(regex);
      });
    } else {
    }
  }

  return (
    <>
      <span className="pacman-staking-bsc-mobile-text11">
        Create Order On Buy
      </span>
      <span className="pacman-staking-bsc-mobile-text12">
        Number of tickets for sale
      </span>
      <input
        type="number"
        placeholder="Enter amount of tickets..."
        className="input pacman-staking-bsc-mobile-textinput"
        onChange={(e: any) => setTickets(e.target.value)}
      />
      <span className="pacman-staking-bsc-mobile-text13">Ticket price</span>
      <input
        type="number"
        placeholder="Enter price per each ticket..."
        className="input pacman-staking-bsc-mobile-textinput"
        onChange={(e: any) => setPrice(e.target.value)}
      />
      <button
        type="button"
        style={{ cursor: "pointer" }}
        className="button pacman-staking-bsc-mobile-button"
        onClick={setOrderOnBuy}
      >
        <span className="pacman-staking-bsc-mobile-text15">
          <span className="pacman-staking-bsc-mobile-text16">Sell tickets</span>
          <br></br>
        </span>
      </button>
    </>
  );
};

export default BuyRequestMobile;
