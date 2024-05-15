"use client";

import dynamic from 'next/dynamic';

const GetHelpScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.GetHelpScreen),
  { ssr: false }
);

export default function GetHelpPage() {
  return <GetHelpScreen/>
}