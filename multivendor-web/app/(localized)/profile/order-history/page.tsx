"use client";

import dynamic from 'next/dynamic';

const OrderHistoryScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.OrderHistoryScreen),
  { ssr: false }
);


export default function OrderHistoryPage() {
  return <OrderHistoryScreen/>
}
