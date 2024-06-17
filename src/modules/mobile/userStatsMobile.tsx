import { useAccount, useNetwork } from "wagmi";

import { getEllipsisTxt } from "@/utils/format";
import { supportedChain } from "@/modules/Chains/chains";
import { useToast, useClipboard } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { wagmiReadContract } from "@/utils/wagmiCalls";
import { useEffect, useState } from "react";

interface UserStats {
  ownedTicketsAmount: BigNumber;
  onSell: BigNumber;
  onBuy: BigNumber;
}

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

const UserStatisticsMobile = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const { onCopy } = useClipboard(address ?? constants.AddressZero);
  const toast = useToast();

  const regex = /reason="([^"]+)"/;

  const [yourTicketsAmount, setYourTicketsAmount] = useState(BigNumber.from(0));
  const [lenOnBuy, setLenOnBuy] = useState("0" as String);
  const [lenOnSell, setLenOnSell] = useState("0" as String);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) {
        return;
      }

      setYourTicketsAmount(await getTicketsAmount());
      setLenOnBuy(
        String(
          ((await getTicketsOnBuy()) as Order[]).reduce(
            (acc: BigNumber, order: Order) =>
              order.user === address ? acc : acc.add(order.amountOfTickets),
            BigNumber.from(0)
          )
        )
      );
      setLenOnSell(
        String(
          ((await getTicketsOnSell()) as Order[]).reduce(
            (acc: BigNumber, order: Order) =>
              order.user === address ? acc : acc.add(order.amountOfTickets),
            BigNumber.from(0)
          )
        )
      );
    };

    if (isConnected) {
      fetchData().catch(console.error);
    }
  }, [isConnected, address]);

  function copy() {
    onCopy;
    toast({
      title: "Copppied!",
      status: "success",
      position: "top",
      isClosable: true,
    });
  }

  async function getTicketsAmount() {
    const fetchData = async () => {
      const userData = (await wagmiReadContract(
        "Staking",
        "getUser",
        [address],
        chain!
      )) as UserStats;
      console.log(JSON.stringify(userData));

      return userData.ownedTicketsAmount;
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
      return await fetchData();
    } catch (message) {
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
    <>
      {address && chain && supportedChain(chain?.id) ? (
        <div className="pacman-staking-bsc-mobile-container03">
          <div className="pacman-staking-bsc-mobile-container04">
            <span className="pacman-staking-bsc-mobile-text01">
              Connected wallet
            </span>
            <span
              onClick={copy}
              style={{ cursor: "pointer" }}
              className="pacman-staking-bsc-mobile-text02"
            >
              {getEllipsisTxt(address)}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      <img
        alt="pastedImage"
        src="/external/pastedimage-ints.svg"
        className="pacman-staking-bsc-mobile-pasted-image03"
      />
      <div className="pacman-staking-bsc-mobile-container05">
        <img
          alt="pastedImage"
          src="/external/pastedimage-h41j.svg"
          className="pacman-staking-bsc-mobile-pasted-image04"
        />
        <div className="pacman-staking-bsc-mobile-container06">
          <span className="pacman-staking-bsc-mobile-text03">Your tickets</span>
          <span className="pacman-staking-bsc-mobile-text04">
            {yourTicketsAmount.toString()}
          </span>
          <span className="pacman-staking-bsc-mobile-text05">
            Available tickets for sale
          </span>
          <span className="pacman-staking-bsc-mobile-text06">{lenOnSell}</span>
          <span className="pacman-staking-bsc-mobile-text07">
            Available tickets for purchase
          </span>
          <span className="pacman-staking-bsc-mobile-text08">
            <span>{lenOnBuy}</span>
            <br></br>
          </span>
        </div>
      </div>
    </>
  );
};

export default UserStatisticsMobile;
