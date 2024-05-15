'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GeneralPage() {

  const router = useRouter();

  useEffect(() => {
    router.push('/admin/store/general/timing');
  }, []);

  return <></>;
}
