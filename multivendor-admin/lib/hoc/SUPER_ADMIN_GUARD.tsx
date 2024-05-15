'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useUserContext } from '@/lib/hooks/useUser';

import { APP_NAME, ROUTES } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const SUPER_ADMIN_GUARD = <T extends object>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUserContext();

    useEffect(() => {

      const isLoggedIn = !!onUseLocalStorage('get', `user-${APP_NAME}`);
      if (!isLoggedIn) {
        router.replace('/authentication/login');
      }

      const findRouteName = ROUTES.find((v) => v.route === pathname);

      if (
        user &&
        user.userType === 'STAFF' &&
        findRouteName &&
        Array.isArray(user.permissions)
      ) {
        const allowed = user?.permissions?.includes(findRouteName?.text);

        if (!allowed) {
          router.replace('/forbidden');
        }
      }

      if (user?.userType === 'RESTAURANT' || user?.userType === 'VENDOR') {
        router.replace('/forbidden');
      }
    }, []);

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default SUPER_ADMIN_GUARD;
