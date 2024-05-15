
'use client';

import { useContext } from 'react';

import { LayoutContext } from '@/lib/context/global/layout.context';

import RestaurantAppTopbar from '@/lib/ui/screen-components/protected/layout/restaurant-layout/app-bar';
import RestaurantSidebar from '@/lib/ui/screen-components/protected/layout/restaurant-layout/side-bar';

import { IProvider, LayoutContextProps } from '@/lib/utils/interfaces';

const RestaurantLayout = ({ children }: IProvider) => {

  const { isRestaurantSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="layout-main">
      <div className="layout-top-container">
        <RestaurantAppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="relative left-0 z-50">
          <RestaurantSidebar />
        </div>
        <div
          className={`h-auto max-w-[100vw] dark:bg-dark-950 ${isRestaurantSidebarVisible ? 'w-[calc(100vw-260px)]' : 'w-full'} px-5`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default RestaurantLayout;
