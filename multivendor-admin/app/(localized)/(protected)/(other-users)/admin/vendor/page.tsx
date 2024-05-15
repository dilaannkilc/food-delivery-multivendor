'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RestaurantPage() {

  const router = useRouter();

  useEffect(() => {
    router.push('/admin/vendor/dashboard'); 
  }, []);

  return <></>;
}
