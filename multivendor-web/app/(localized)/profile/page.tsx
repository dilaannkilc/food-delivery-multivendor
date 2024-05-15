"use client";
import dynamic from 'next/dynamic';

const PersonalInfoScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.PersonalInfoScreen),
  { ssr: false }
);


export default function PersonalInfo() {
  return (
    <PersonalInfoScreen/>
  )
}
