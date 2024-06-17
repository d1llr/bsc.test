import * as contractJson from "./contracts/contracts.json";
import { ethers } from "ethers";

export const chainIds = ["56"] as const;
export type ChainId = (typeof chainIds)[number];

function findContract(key: string, chainId: ChainId): any {
  const contracts = contractJson?.[chainId]?.[0]?.contracts;
  const value = contracts[key as keyof typeof contracts];

  if (value) {
    return value;
  }

  throw Error(`${key} not found into contracts.json`);
}

function getABI(key: string, chainId: number): any {
  try {
    return findContract(key, chainId.toString() as ChainId).abi;
  } catch (e) {
    return null;
  }
}

function getAddress(key: string, chainId: number): string {
  try {
    return findContract(key, chainId.toString() as ChainId).address;
  } catch (e) {
    return ethers.constants.AddressZero;
  }
}

export { getABI, getAddress };
