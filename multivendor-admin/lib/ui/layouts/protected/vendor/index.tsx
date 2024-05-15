
'use client';

import { useContext } from 'react';

import { LayoutContext } from '@/lib/context/global/layout.context';

import VendorAppTopbar from '@/lib/ui/screen-components/protected/layout/vendor-layout/app-bar';
import VendorSidebar from '@/lib/ui/screen-components/protected/layout/vendor-layout/side-bar';

import { IProvider, LayoutContextProps } from '@/lib/utils/interfaces';

const VendorLayout = ({ children }: IProvider) => {

  const { isVendorSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="layout-main">
      <div className="layout-top-container">
        <VendorAppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="relative left-0 z-50">
          <VendorSidebar />
        </div>
        <div
          className={`h-auto max-w-[100vw] dark:bg-dark-950 w-full ${isVendorSidebarVisible ? 'w-[calc(100vw-260px)]' : 'w-full'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
