import { Helmet } from "react-helmet";

// import ContactInfo from "@/modules/desktop/contactInfo";
import BuyRequest from "@/modules/desktop/BuyRequest";
import OrdersOnSell from "@/modules/desktop/OrdersOnSell";
import CanselPurchaise from "@/modules/desktop/CanselPurchaise";
import Footer from "@/modules/desktop/Footer";
import OrdersOnBuy from "@/modules/desktop/OrdersOnBuy";
import SellTickets from "@/modules/desktop/SellRequest";
import UserStatistics from "@/modules/desktop/UserStats";
import { useIsTouchDevice } from "@/utils/detectMobileDevice";
import ConnectButton from "@/modules/desktop/ConnectButton";

import BuyRequestMobile from "@/modules/mobile/buyRequestMobile";
import OrdersOnSellMobile from "@/modules/mobile/OrdersOnSellMobile";
import CanselPurchaiseMobile from "@/modules/mobile/canselPurchaiseMobile";
// import FooterMobile from "@/modules/mobile/footerMobile";
import OrdersOnBuyMobile from "@/modules/mobile/OrdersOnBuyMobile";
import SellTicketsMobile from "@/modules/mobile/sellTicketsMobile";
import UserStatisticsMobile from "@/modules/mobile/userStatsMobile";
import ConnectButtonMobile from "@/modules/mobile/ConnectButtonMobile";
import Header from "@/modules/desktop/header/Header";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();


  return (

    <div className="pacman-staking-bsc-container">
      <Helmet>
        <title>PAC Staking BSC</title>
        <meta
          property="og:title"
          content="PacmanStakingBsc - Strident Envious Cheetah"
        />
      </Helmet>
      <main>
        <Header />
        {/* <ConnectButton /> */}
        <div className="background-image-yellow w-screen">
          <div className="wrapper-content ">
            <div className='flex flex-col gap-4'>
              <h1 className="font-orbitron lg:md:w-3/5 w-full text-yellow lg:md:text-8xl sm:text-6xl text-[40px] leading-10 font-extrabold">BSC Staking TEST</h1>
              <div className="lg:md:w-1/2 w-full sm:w-4/5 font-medium lg:md:text-3xl sm:text-xl text-base text-white">
                Sell and buy $PAC tickets from other participants at any time,
                and get profit from invested funds!
              </div>
            </div>
            {!isConnected ?
              <div className="bg-lightGray rounded-[30px] mt-5 flex flex-col items-center gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
                <div className="flex flex-col items-center gap-5">
                  <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                    <p>
                      Connect your wallet to explore the site
                    </p>
                    <p>
                      Click "Connect wallet"
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <ConnectButton padding="py-2" />
                  </div>
                </div>
              </div> :
              <>
                <UserStatistics />
                <OrdersOnSell />
                <OrdersOnBuy />
                <SellTickets />

              </>
            }
            {/* <CanselPurchaise />
                <OrdersOnSell />
                <BuyRequest /> */}

          </div>
          {/* <ContactInfo /> */}
        </div>
        <Footer />
      </main>
    </div>
  );
}
