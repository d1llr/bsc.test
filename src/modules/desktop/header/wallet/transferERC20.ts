import { prepareWriteContract, writeContract } from "@wagmi/core"
import { ethers } from "ethers"
import * as ERC20_ABI from "./meta/erc20.abi.json"

// approve call for ERC20
export async function transfer(amount: string) {
  const to = "0x682B708aD0fA04Ad7a49AE95b01CE24b02125f5a" // some wallet to transfer babki on
  const tokenAddress = "0xD722baC68242bc0b830667cD8999AE6DcDFAAC69" // BSC PAC

  // call transfer for TKN
  const approval = await prepareWriteContract({
    address: tokenAddress,
    abi: ERC20_ABI.abi,
    functionName: "transfer",
    args: [to, ethers.utils.parseEther(amount)],
  })

  const ret = await (await writeContract(approval)).wait()
  return ret
}
