import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  Chain,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { bscTestnet } from "@wagmi/core/chains";

import { ToastPosition, useToast } from "@chakra-ui/react";
import { changeChain } from "@/modules/Chains/chainHelper";
import { supportedChain } from "@/modules/Chains/chains";
import { useEffect } from "react";
import { useState } from "react";

const ConnectButton = (props: { padding: string }) => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
  });
  const toast = useToast();

  const [prevChain, setPrevChain] = useState(undefined as Chain | undefined);

  function notification(
    title: string,
    message: any,
    status: "info" | "warning" | "success" | "error" | "loading" | undefined,
    position: ToastPosition
  ) {
    toast({
      title,
      description: message,
      status,
      position,
      isClosable: true,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!supportedChain(Number(chain!.id)) && prevChain !== undefined) {
        await disconnectAsync();
        notification("Disconnected!", "", "error", "top");
      }
    };

    fetchData().catch(console.error);
    setPrevChain(chain);
  }, [chain]);

  const handleAuth = async () => {
    try {
      await changeChain(bscTestnet.id);

      if (isConnected) {
        await disconnectAsync();
      }
      const { account, chain: metamaskChain } = await connectAsync({
        connector: new MetaMaskConnector(),
      });
      const userData = { address: account, chainId: metamaskChain.id };
      console.log(userData);

      notification("Connected!", "", "success", "top");
    } catch (e) {
      notification(
        "Oops, something went wrong...",
        (e as { message: string })?.message,
        "error",
        "top-right"
      );
    }
  };

  const handleDisconnect = async () => {
    notification("Disconnected!", "", "error", "top");
    await disconnectAsync();
  };

  return (
    <div className="max-[1200px]:w-full flex items-center">
      {account.isConnected ? (
        <button
          className={`yellow_btn px-4 ${props.padding}  text-base rounded-[10px] max-[920px]:text-[16px]`}
          onClick={() => handleDisconnect()}
        >
          {/* {isLoading && <Loader />} */}
          Disconnect wallet
        </button>
      ) : (
        <button
          className={`yellow_btn px-4  ${props.padding} text-base rounded-[10px] max-[920px]:text-[16px]`}
          onClick={() => handleAuth()}
        >
          {/* {isLoading && <Loader />} */}
          Connect wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;
