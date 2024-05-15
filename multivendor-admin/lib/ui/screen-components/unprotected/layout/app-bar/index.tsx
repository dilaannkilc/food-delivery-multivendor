

'use client';

import Link from 'next/link';

import { AppLogo } from '@/lib/utils/assets/svgs/logo';

import classes from './app-bar.module.css';

const AppTopbar = () => {
  return (
    <div className={`${classes['layout-topbar']} dark:bg-dark-900`}>
      <div>
        <div className="flex flex-row items-center gap-6">
          <Link href="/" className="layout-topbar-log">
            <AppLogo />
          </Link>
        </div>
      </div>
    </div>
  );
};

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
