'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import {
  IProvider,
  IQueryResult,
  IVendorContextProps,
  IVendorReponse,
  IVendorResponseGraphQL,
} from '@/lib/utils/interfaces';

import { GET_VENDORS } from '@/lib/api/graphql';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import { onFilterObjects, onUseLocalStorage } from '@/lib/utils/methods';
import { SELECTED_VENDOR_EMAIL } from '@/lib/utils/constants';

export const VendorContext = createContext<IVendorContextProps>(
  {} as IVendorContextProps
);

export const VendorProvider = ({ children }: IProvider) => {

  const [vendorFormVisible, setVendorFormVisible] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<IVendorReponse[]>();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isEditingVendor, setIsEditing] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);


  const vendorResponse = useQueryGQL(GET_VENDORS, {
    debounceMs: 300,
    onCompleted: (data: unknown) => {
      const _data = data as IVendorResponseGraphQL;
      setVendorId(_data?.vendors[0]?._id ?? '');
      onUseLocalStorage(
        'save',
        SELECTED_VENDOR_EMAIL,
        _data?.vendors[0]?.email
      );
      setFiltered(_data.vendors);

    },
  }) as IQueryResult<IVendorResponseGraphQL | undefined, undefined>;

  const onSetVendorFormVisible = (status: boolean, isEdit?: boolean) => {
    setVendorFormVisible(status);

    if (isEdit !== undefined) {
      setIsEditing(isEdit);
    }
  };
  const onSetVendorId = (id: string) => {
    setVendorId(id);
  };

  const onSetGlobalFilter = (filter: string) => {
    setGlobalFilter(filter);
  };

  const onSetEditingVendor = (status: boolean) => {
    setIsEditing(status);
  };

  const onResetVendor = (state: boolean) => {
    setIsReset(state);
  };

  const onHandlerFilterData = () => {
    const _filtered: IVendorReponse[] = onFilterObjects(
      vendorResponse?.data?.vendors ?? [],
      globalFilter,
      [`name`,'email', 'userType', 'unique_id']
    );

    setVendorId(_filtered[0]?._id ?? '');
    setFiltered(_filtered);
  };

  const onVendorReponseFetchCompleted = useCallback(() => {

    if (!isReset) return;
    setVendorId(vendorResponse?.data?.vendors[0]?._id ?? '');
    onUseLocalStorage(
      'save',
      SELECTED_VENDOR_EMAIL,
      vendorResponse?.data?.vendors[0]?.email
    );
    setIsReset(false);
  }, [vendorResponse?.data?.vendors]);

  useEffect(() => {
    if (
      vendorResponse?.data?.vendors &&
      vendorResponse?.data?.vendors.length > 0
    ) {
      onHandlerFilterData();
    }
  }, [vendorResponse?.data?.vendors, globalFilter]);

  useEffect(() => {
    onVendorReponseFetchCompleted();
  }, [vendorResponse?.data]);

  const value: IVendorContextProps = {
    vendorFormVisible,
    onSetVendorFormVisible,
    vendorId,
    onSetVendorId,

    vendorResponse,

    globalFilter,
    onSetGlobalFilter,
    filtered,

    isEditingVendor,
    onSetEditingVendor,

    onResetVendor,
  };

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};
