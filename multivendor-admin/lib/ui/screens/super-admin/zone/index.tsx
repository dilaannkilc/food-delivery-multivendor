'use client';

import React, { useState } from 'react';

import { IZoneResponse } from '@/lib/utils/interfaces';

import ZoneAddForm from '@/lib/ui/screen-components/protected/super-admin/zone/form';
import ZoneHeader from '@/lib/ui/screen-components/protected/super-admin/zone/view/header/screen-header';
import ZoneMain from '@/lib/ui/screen-components/protected/super-admin/zone/view/main';

export default function ZoneScreen() {

  const [isAddRiderVisible, setIsAddRiderVisible] = useState(false);
  const [zone, setZone] = useState<IZoneResponse | null>(null);

  const onSetAddFormVisible = () => {
    setIsAddRiderVisible(true);
    setZone(null);
  };

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden p-3">
        <ZoneHeader onSetAddFormVisible={onSetAddFormVisible} />
        <div className="flex-grow overflow-y-auto">
          <ZoneMain
            setIsAddZoneVisible={setIsAddRiderVisible}
            setZone={setZone}
          />
        </div>

        <ZoneAddForm
          isAddZoneVisible={isAddRiderVisible}
          onHide={() => setIsAddRiderVisible(false)}
          zone={zone}
        />
      </div>
    </>
  );
}
