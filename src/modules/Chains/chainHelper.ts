import { ChainId, NETWORKS, hexId } from "./chains";

export async function changeChain(to: ChainId): Promise<boolean> {
  try {
    if (!window.ethereum) {
      throw new Error("No crypto wallet found");
    }

    try {
      await window.ethereum?.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId(Number(to)) }],
      });
      return true;
    } catch (error) {
      if ((error as any).code === 4902) {
        const result = async () => {
          const param = {
            chainId: hexId(Number(to)),
            chainName: NETWORKS[to].name,
            nativeCurrency: {
              name: NETWORKS[to].symbol,
              symbol: NETWORKS[to].symbol,
              decimals: 18,
            },
            rpcUrls: [NETWORKS[to].rpc],
            blockExplorerUrls: [NETWORKS[to].scanner],
          };
          await window.ethereum?.request?.({
            method: "wallet_addEthereumChain",
            params: [param],
          });
        };

        if (!result) {
          return false;
        }
      }
      return true;
    }
  } catch (e) {
    console.error(e);
  }

  return false;
}
