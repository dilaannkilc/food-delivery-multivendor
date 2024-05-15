
import { MotiView } from "moti";

import WalletHeadingSkeleton from "./wallet-heading";
import WalletRecentTransactionSkeleton from "./wallet-recent-transactions";
import WalletTopInfoSkeleton from "./wallet-top-info";

import { useApptheme } from "@/lib/context/theme.context";

export default function WalletScreenMainLoading() {

  const { appTheme } = useApptheme();
  return (
    <MotiView
      className="flex flex-co justify-evenly h-full w-full"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <WalletTopInfoSkeleton />
      <WalletHeadingSkeleton />
      <WalletRecentTransactionSkeleton />
    </MotiView>
  );
}
