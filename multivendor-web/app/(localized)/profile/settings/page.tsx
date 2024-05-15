"use client";
import dynamic from 'next/dynamic';

const SettingsScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.SettingsScreen),
  { ssr: false }
);


export default function SettingsPage() {
  return <SettingsScreen/>
}