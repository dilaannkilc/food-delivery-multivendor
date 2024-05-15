"use client";

import dynamic from 'next/dynamic';

const CustomerTicketsScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.CustomerTicketsScreen),
  { ssr: false }
);

export default function CustomerTicketsPage() {
  return <CustomerTicketsScreen/>
}