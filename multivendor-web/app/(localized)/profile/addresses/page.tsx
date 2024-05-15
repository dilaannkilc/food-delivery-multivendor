"use client";

import dynamic from 'next/dynamic';

const AddressesScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.AddressesScreen),
  { ssr: false }
);


export default function Addresses() {
  return <AddressesScreen/>
}
