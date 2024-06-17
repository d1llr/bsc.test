import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { getABI, getAddress } from "./contracts";
import { Chain } from "wagmi";
import { BigNumber, ethers } from "ethers";

// read
export async function wagmiReadContract(
  contractName: string,
  contractFunction: string,
  args: unknown[],
  chain: Chain
): Promise<any> {
  const data = await readContract({
    address: getAddress(contractName, Number(chain?.id)),
    abi: getABI(contractName, Number(chain?.id)),
    functionName: contractFunction,
    args: [...args],
  });

  return data;
}

// write/call
export async function wagmiWriteContract(
  contractName: string,
  contractFunction: string,
  args: unknown[],
  value: BigNumber,
  chain: Chain
): Promise<string> {
  const args_ = [...args];
  if (value !== ethers.constants.Zero) {
    args_.push({ value });
  }

  // call market contract
  const config = await prepareWriteContract({
    address: getAddress(contractName, Number(chain?.id)),
    abi: getABI(contractName, Number(chain?.id)),
    functionName: contractFunction,
    args: [...args_],
  });

  const { hash } = await writeContract(config);
  return String(hash);
}

// approve ERC20
export async function approveERC20(
  to: string,
  _amount: BigNumber,
  chain: Chain
) {
  const approveTo = ethers.utils.isAddress(to)
    ? to
    : getAddress(to, Number(chain?.id));
  const pacAddress = getAddress("PAC", Number(chain?.id));
  const pacAbi = getABI("PAC", Number(chain?.id));

  // call approve for PAC
  const configNFT = await prepareWriteContract({
    address: pacAddress,
    abi: pacAbi,
    functionName: "approve",
    args: [approveTo, _amount],
  });

  await (await writeContract(configNFT)).wait();
}
