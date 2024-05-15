'use client';

import { useState } from 'react';
import CustomerSupportMain from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/main';
import CustomerSupportMobilesTabs from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/mobile-tabs';
import { useTranslations } from 'next-intl';
import HeaderText from '@/lib/ui/useable-components/header-text';

type CustomerSupportTabType = 'tickets' | 'chats';

export default function CustomerSupportScreen() {

  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<CustomerSupportTabType>('tickets');
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {}
      <div className="w-full flex-shrink-0 border-b dark:border-dark-600 p-3">
        <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
          <HeaderText text={t('CustomerSupport')} />
        </div>
      </div>
      
      {}
      <CustomerSupportMobilesTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {}
      <CustomerSupportMain 
        activeTab={activeTab}
      />
    </div>
  );
}