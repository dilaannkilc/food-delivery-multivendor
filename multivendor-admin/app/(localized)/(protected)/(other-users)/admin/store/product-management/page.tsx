'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FoodManagementPage() {

  const router = useRouter();

  useEffect(() => {
    router.push('/admin/store/food-management/food');
  }, []);

  return <></>;
}
