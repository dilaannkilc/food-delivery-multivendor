
import { useState } from 'react';

import AddonsAddForm from '@/lib/ui/screen-components/protected/restaurant/add-on/add-form';
import AddonsHeader from '@/lib/ui/screen-components/protected/restaurant/add-on/view/header/screen-header';
import AddonsMain from '@/lib/ui/screen-components/protected/restaurant/add-on/view/main';

import { IAddon } from '@/lib/utils/interfaces/add-on.interface';

export default function AddonsScreen() {

  const [isAddAddonVisible, setIsAddAddonVisible] = useState(false);
  const [addon, setAddon] = useState<IAddon | null>(null);

  return (
    <div className="screen-container">
      <AddonsHeader setIsAddAddonVisible={setIsAddAddonVisible} />

      <AddonsMain
        setIsAddAddonVisible={setIsAddAddonVisible}
        setAddon={setAddon}
      />

      <AddonsAddForm
        addon={addon}
        onHide={() => {
          setIsAddAddonVisible(false);
          setAddon(null);
        }}
        isAddAddonVisible={isAddAddonVisible}
      />
    </div>
  );
}
