"use client"
import OrderCardSkeleton from "@/lib/ui/useable-components/custom-skeletons/order.card.skelton";
import OrderCard from "@/lib/ui/useable-components/order-card";
import EmptyState from "@/lib/ui/useable-components/orders-empty-state";
import { IActiveOrdersProps, IOrder } from "@/lib/utils/interfaces/orders.interface";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { useTranslations } from "next-intl";


export default function ActiveOrders({ activeOrders, isOrdersLoading }: IActiveOrdersProps) {
  const t = useTranslations()
  const router = useRouter()


  const handleTrackOrderClicked = useDebounceFunction((orderId: string | undefined) => {
    console.log("orderId", orderId)
    router.push(`/order/${orderId}/tracking`);
  }, 500);

  if (isOrdersLoading) {
    return (
      <OrderCardSkeleton count={2} />
    )
  }

  if (activeOrders?.length === 0) {
    return (
      <EmptyState
        title={t("no_active_orders_title")}
        message={t("no_active_orders_message")}
        actionLabel={t("browse_store_button")}
        actionLink="/store"
      />
    )
  }






  return (
    <div className="space-y-4 py-4">
      <TextComponent text={t("active_orders_title")} className="text-xl md:text-2xl font-semibold mb-6 dark:text-gray-100" />
      <div className="space-y-4">
        {activeOrders?.map((order: IOrder) => (
          <OrderCard
            key={order._id}
            order={order}
            handleTrackOrderClicked={handleTrackOrderClicked}
            type="active"
            className={twMerge(
              "border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800",




            )}
          />
        ))}
      </div>
    </div>
  )
}