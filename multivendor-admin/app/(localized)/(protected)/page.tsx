'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { SidebarContext } from '@/lib/context/global/sidebar.context';

import { ILoginResponse, ISidebarContextProps } from '@/lib/utils/interfaces';
import { onUseLocalStorage } from '@/lib/utils/methods';
import { APP_NAME } from '@/lib/utils/constants';
import { DEFAULT_ROUTES } from '@/lib/utils/constants/routes';

export default function RootPage() {

  const { setSelectedItem } = useContext<ISidebarContextProps>(SidebarContext);

  const router = useRouter();

  useEffect(() => {
    setSelectedItem({ screenName: 'Home' });
    const user = onUseLocalStorage('get', `user-${APP_NAME}`);
    if (user) {
      const userInfo: ILoginResponse = JSON.parse(user);
      router.push(DEFAULT_ROUTES[userInfo.userType]);
    } else {
      router.replace('/authentication/login');
    }
  }, []);

  return <></>;
}
