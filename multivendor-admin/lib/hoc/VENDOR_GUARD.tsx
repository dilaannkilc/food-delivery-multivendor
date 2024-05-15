'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@/lib/hooks/useUser';

import { APP_NAME } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const VENDOR_GUARD = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (props: T) => {
    const router = useRouter();
    const { user } = useUserContext();

    useEffect(() => {

      const isLoggedIn = !!onUseLocalStorage('get', `user-${APP_NAME}`);
      if (!isLoggedIn) {
        router.replace('/authentication/login');
      }

      if (user && user.userType === 'STAFF') {
        const allowed = user?.permissions?.includes('Vendors');

        if (!allowed) {
          router.replace('/forbidden');
        }
      }

      if (user?.userType === 'RESTAURANT') {
        router.replace('/forbidden');
      }
    }, []);

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default VENDOR_GUARD;
