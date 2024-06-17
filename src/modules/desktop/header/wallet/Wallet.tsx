import { memo, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// wagmi
import { bsc } from "@wagmi/core/chains"
import { Connector, useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { changeChain } from "./meta/chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { supportedChain } from "./meta/chains"
import { useToast } from "@chakra-ui/react"
import { DEFAULT_CHAINID } from '../../../Chains/chains'
import { BigNumber } from "ethers"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { PoolsType, clearPools, setAddress, setAllUserTickets, setMaxTicketInPool, setNodes, setPullStatus } from "../../../../app/slices/Rede.slice"

export function sum(a: number, b: number) {
  return a + b;
}


interface IWalletProps {
  padding: string
}


type IAccount = {
  address?: `0x${string}` | undefined,
  connector?: Connector<any, any, any>  | undefined
  isReconnected: boolean
}

const Wallet = memo((props: IWalletProps) => {
  const dispach = useAppDispatch()
  const nodes = useAppSelector(state => state.RedeSlice.nodes)
  const toast = useToast()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { chain } = useNetwork()
  const account = useAccount({
    onConnect({ address, connector, isReconnected }: IAccount) {
      console.log("Connected", { address, connector, isReconnected })
    },
  })

  // dispach(setConnector(account.address))

  const [needToSwitch, setNeedToSwitch] = useState(false)
  useEffect(() => {
    chain?.id && supportedChain(chain?.id)
      ? setNeedToSwitch(false)
      : setNeedToSwitch(true)
  }, [chain])

  async function handleConnectWallet(): Promise<void> {
    try {
      // connect logic
      await changeChain(Number(DEFAULT_CHAINID))
      if (account.isConnected) {
        await disconnectAsync()
      }
      const { account: accountAddress, chain: metamaskChain, } = await connectAsync({
        connector: new MetaMaskConnector(),
      })


      const userData = { address: accountAddress, chainId: metamaskChain.id }
      dispach(setAddress(accountAddress))
      const id = BigNumber.from(1)
      // const myStore = new useFundStore();
      // dispach(setConnector(myStore))


      // let nodes = await myStore.getUserNodes()
      // dispach(setNodes(nodes))
      // console.log(nodes);

      // let maxTicketInPool = await myStore.maxTicketsAmountInPool()
      // dispach(setMaxTicketInPool(maxTicketInPool))
      // dispach(setPullStatus('pending'))
      // wallets.map(async (wallet, index) => {
      //   let user = (await myStore.getUser(accountAddress, BigNumber.from(index)))
      //   // console.log('user:', user);


      //   await myStore.getUserAmount(index).then(async res => {
      //     dispach(setPools({
      //       index: index,
      //       user_tickets: res,
      //       user_on_buy: Number(user.onBuy),
      //       user_on_sell: Number(user.onSell),
      //       available_tickets: maxTicketInPool - Number(wallet.ticketsBought),
      //       sales_requests: await myStore.getLenOnSell(BigNumber.from(index)),
      //       purchase_requests: await myStore.getLenOnBuy(BigNumber.from(index))
      //     }))
      //   })

      // })
      // await myStore.getAllUserTickets().then(AllUserTickets => {

      //   console.log(AllUserTickets);

      //   dispach(setAllUserTickets(AllUserTickets))
      // })
      setTimeout(() => {

        dispach(setPullStatus('fulfilled'))
      }, 2000);

      // dispach(setPools(res))



      // DB logic


      console.log("User data: ", userData)
    } catch (e) {
      const error = (e as { message: string })?.message
      console.error("Error while disconnect: ", error)

      if (
        error.includes("No crypto wallet found") ||
        error.includes("Connector not found")
      ) {
        window.open("https://metamask.io/", "_blank")
      }
    }
  }
  async function handleDisconnectWallet(): Promise<void> {
    if (account.isConnected) {
      await disconnectAsync()
      dispach(clearPools())
      dispach(setPullStatus('Uninitialized'))

    }
  }

  const navigate = useNavigate()

  return (
    <div className="max-[1200px]:w-full">
      {account.isConnected ?
        <button
          className={`yellow_btn px-4 ${props.padding} text-base rounded-[10px] max-[920px]:text-[16px]`}
          onClick={() => handleDisconnectWallet()}
        >
          {/* {isLoading && <Loader />} */}
          Disconnect wallet
        </button>
        :
        <button
          className={`yellow_btn px-4 ${props.padding} text-base rounded-[10px] max-[920px]:text-[16px]`}
          onClick={() => handleConnectWallet()}
        >
          {/* {isLoading && <Loader />} */}
          Connect wallet
        </button>}
    </div>
  )
})

export default Wallet
