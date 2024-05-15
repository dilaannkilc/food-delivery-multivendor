
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import { VendorContext } from '@/lib/context/super-admin/vendor.context';

import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

import HeaderText from '@/lib/ui/useable-components/header-text';
import { useTranslations } from 'next-intl';

export default function VendorHeader() {

  const t = useTranslations();

  const { onSetVendorFormVisible, globalFilter, onSetGlobalFilter } =
    useContext(VendorContext);

  return (
    <div className="hidden w-full flex-shrink-0 border-b dark:border-dark-600 p-3 sm:block dark:bg-dark-950 dark:text-white">
      <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
        <HeaderText text={t('Vendors')} />

        <TextIconClickable
          className="rounded border border-gray-300 bg-black dark:bg-dark-950  text-white sm:w-auto dark:border-dark-600"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Vendor')}
          onClick={() => {
            onSetVendorFormVisible(true);
          }}
        />
      </div>

      <div className="flex-colm:flex-row flex w-fit items-center space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            placeholder={t('Keyword Search')}
            showLabel={false}
            value={globalFilter ?? ''}
            onChange={(e) => onSetGlobalFilter(e.target.value)}
          />
        </div>
        {}
      </div>
    </div>
  );
}
