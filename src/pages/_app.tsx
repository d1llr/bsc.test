import { Chain, createClient, WagmiConfig } from "wagmi";
import { configureChains } from "@wagmi/core";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/styles/pacman-staking-bsc.css";
import "@/styles/pacman-staking-bsc-mobile.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";

const bscCustom: Chain = {
  id: 56,
  name: "BNB Smart Chain",
  network: "bsc",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: [
        "https://bsc-dataseed1.binance.org/",
        "https://bsc-dataseed2.binance.org/",
        "https://bsc-dataseed3.binance.org/",
        "https://bsc-dataseed4.binance.org/",
      ],
    },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
    etherscan: { name: "BscScan", url: "https://bscscan.com" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 15921452,
    },
  },
  testnet: false,
};

const { provider, webSocketProvider } = configureChains(
  [bscCustom],
  [publicProvider()]
);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: false,
});



const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ChakraProvider resetCSS={true} disableGlobalStyle={true}>
        <WagmiConfig client={client}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
          </SessionProvider>
        </WagmiConfig>
      </ChakraProvider>
    </Provider>
  );
};
export default MyApp;
