import { ChainId, NETWORKS, hexId } from "./chains"

export async function changeChain(to: ChainId): Promise<boolean> {
  try {
    if (!window.ethereum) {
      throw new Error("No crypto wallet found")
    }

    try {
      await window.ethereum?.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId(Number(to)) }],
      })
    } catch (e) {
      console.error("Error while 'switch chain': ", e)
      if ((e as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexId(Number(to)),
                chainName: NETWORKS[to].name,
                rpcUrls: [NETWORKS[to].rpc],
                nativeCurrency: {
                  name: NETWORKS[to].symbol,
                  symbol: NETWORKS[to].symbol,
                  decimals: 18,
                },
                blockExplorerUrls: [NETWORKS[to].scanner],
              },
            ],
          })
        } catch (e) {
          console.error("Error while 'add chain': ", e)
          return false
        }
      } else {
        return false
      }
    }
  } catch (e) {
    console.error(e)
    return false
  }

  return true
}
