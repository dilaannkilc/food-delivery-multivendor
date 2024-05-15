'use client';

import { useContext, useState } from 'react';

import RestaurantForm from '@/lib/ui/screen-components/protected/super-admin/vendor/form/restaurant-add-form';
import VendorAddForm from '@/lib/ui/screen-components/protected/super-admin/vendor/form/vendor-add-form';
import VendorHeader from '@/lib/ui/screen-components/protected/super-admin/vendor/view/header';
import VendorMain from '@/lib/ui/screen-components/protected/super-admin/vendor/view/main';
import VendorMobilesTabs from '@/lib/ui/screen-components/protected/super-admin/vendor/view/mobile-tabs';

import { options } from '@/lib/utils/constants';

import { RestaurantContext } from '@/lib/context/super-admin/restaurant.context';
import { VendorContext } from '@/lib/context/super-admin/vendor.context';
import { TVendorMobileTabs } from '@/lib/utils/types';

export default function VendorsScreen() {

  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>(
    options[1]
  );
  const [selectedRestaurantFilter, setSelectedResturantFilter] =
    useState<string>(options[1]);
  const [activeTab, setActiveTab] = useState<TVendorMobileTabs>('vendors');

  const { vendorFormVisible } = useContext(VendorContext);
  const { isRestaurantFormVisible } = useContext(RestaurantContext);

  return (
    <div className="flex h-screen flex-col dark:bg-dark-950">
      <VendorHeader


      />

      <VendorMobilesTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <VendorMain

        activeTab={activeTab}
        selectedVendorFilter={selectedVendorFilter}
        selectedRestaurantFilter={selectedRestaurantFilter}

        setActiveTab={setActiveTab}
        setSelectedResturantFilter={setSelectedResturantFilter}
        setSelectedVendorFilter={setSelectedVendorFilter}
      />

      {vendorFormVisible && <VendorAddForm />}
      {isRestaurantFormVisible && <RestaurantForm />}
    </div>
  );
}
