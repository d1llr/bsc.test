import { OctaLogo, BSCLogo, PolygonLogo, ETHLogo, AvaxLogo } from "./Logos";
import { bsc } from "@wagmi/core/chains";

// \\//\\//\\//\\// interfaces & types \\//\\//\\//\\//

export type ChainId = (typeof registerdChainIds)[number];

export interface network {
  rpc: string;
  chainId: number;
  scanner: string;
  name: string;
  symbol: string;
  short: string;
  type: "mainnet" | "testnet";
  logo: any;
}

type MapType = {
  [token: string]: network;
};

// \\//\\//\\//\\// constants & variables \\//\\//\\//\\//

const networks: MapType = {
  localhost: {
    rpc: "http://127.0.0.1:8545/",
    chainId: 31337,
    scanner: "/",
    name: "Localhost",
    symbol: "L",
    short: "localhost",
    type: "testnet",
    logo: ETHLogo(),
  },
  bsc_testnet: {
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    chainId: 97,
    scanner: "https://testnet.bscscan.com/",
    name: "Binance Smart Chain Testnet",
    symbol: "BNB",
    short: "bsc_testnet",
    type: "testnet",
    logo: BSCLogo(),
  },
  bsc_mainnet: {
    rpc: "https://bsc-dataseed1.binance.org/",
    chainId: 56,
    scanner: "https://bscscan.com/",
    name: "Binance Smart Chain",
    symbol: "BNB",
    short: "bsc_mainnet",
    type: "mainnet",
    logo: BSCLogo(),
  },
  octa: {
    rpc: "https://rpc.octa.space",
    chainId: 800001,
    scanner: "https://explorer.octa.space/",
    name: "Octa Space",
    symbol: "OCTA",
    short: "octa",
    type: "mainnet",
    logo: OctaLogo(),
  },
  avax_testnet: {
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    chainId: 43113,
    scanner: "https://testnet.snowtrace.io/",
    name: "Avalanche C-Chain Testnet",
    symbol: "AVAX",
    short: "avax_testnet",
    type: "testnet",
    logo: AvaxLogo(),
  },
  polygon_testnet: {
    rpc: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
    chainId: 80001,
    scanner: "https://mumbai.polygonscan.com",
    name: "Mumbai",
    symbol: "MATIC",
    short: "polygon_testnet",
    type: "testnet",
    logo: PolygonLogo(),
  },
};

export const NETWORKS: MapType = {
  "800001": networks.octa,
  "33137": networks.localhost,
  "43113": networks.avax_testnet,
  "80001": networks.polygon_testnet,
  "97": networks.bsc_testnet,
  "56": networks.bsc_mainnet,
};

export const registerdChainIds: number[] = [97];

export const DEFAULT_CHAINID = registerdChainIds[0];

// \\//\\//\\//\\// functions \\//\\//\\//\\//

export function hexId(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

export function supportedChain(chainId: number): boolean {
  return registerdChainIds.find((element) => element === chainId) !== undefined;
}
