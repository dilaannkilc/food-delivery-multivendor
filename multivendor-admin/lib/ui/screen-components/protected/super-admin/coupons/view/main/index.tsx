
import './index.module.css';

import { DELETE_COUPON, GET_COUPONS } from '@/lib/api/graphql';
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

import {
  IActionMenuItem,
  IEditState,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';
import {
  ICoupon,
  ICouponMainProps,
  IGetCouponsData,
} from '@/lib/utils/interfaces/coupons.interface';
import { IFilterType } from '@/lib/utils/interfaces/table.interface';

import { FilterMatchMode } from 'primereact/api';

import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@apollo/client';

import { ToastContext } from '@/lib/context/global/toast.context';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import CouponTableHeader from '../header/table-header';

import { generateDummyCoupons } from '@/lib/utils/dummy';
import { COUPONS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/coupons-columns';

export default function CouponsMain({
  setVisible,
  isEditing,
  setIsEditing,
}: ICouponMainProps) {

  const t = useTranslations();

  const { showToast } = useContext(ToastContext);

  const [selectedData, setSelectedData] = useState<ICoupon[]>([]);
  const [isDeleting, setIsDeleting] = useState<IEditState<ICoupon>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      discount: 0,
      enabled: false,
      title: '',
      lifeTimeActive: false,
      startDate: '',
      endDate: '',
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filters: IFilterType = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },

    enabled: {
      value:
        selectedActions.includes('true') && selectedActions.includes('false')
          ? ''
          : selectedActions,
      matchMode: FilterMatchMode.CONTAINS,
    },
  };

  const { data, fetch } = useLazyQueryQL(GET_COUPONS, {
    fetchPolicy: 'network-only',
    debounceMs: 5000,
    onCompleted: () => setIsLoading(false),
  }) as ILazyQueryResult<IGetCouponsData | undefined, undefined>;

  const [deleteCoupon, { loading: deleteCouponLoading }] = useMutation(
    DELETE_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: t('Delete Coupon'),
          type: 'success',
          message: t('Coupon has been deleted successfully'),
          duration: 2000,
        });
      },
      onError: (err) => {
        showToast({
          title: t('Delete Coupon'),
          type: 'error',
          message:
            err.message || t('An unknown error occured, please try again'),
          duration: 2000,
        });
      },
    }
  );

  async function deleteItem() {
    await deleteCoupon({
      variables: {
        id: isDeleting?.data?._id,
      },
    });
    setIsDeleting({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        discount: 0,
        enabled: false,
        title: '',
        lifeTimeActive: false,
        startDate: '',
        endDate: '',
      },
    });
  }

  const menuItems: IActionMenuItem<ICoupon>[] = [
    {
      label: t('Edit'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsEditing({
            bool: true,
            data: data,
          });
          setIsDeleting({
            bool: false,
            data: { ...isDeleting.data },
          });
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsDeleting({
            bool: true,
            data: data,
          });
          setIsEditing({
            bool: false,
            data: { ...isEditing.data },
          });
        }
      },
    },
  ];

  useEffect(() => {
    if (isEditing.bool) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [data, isEditing.bool]);

  useEffect(() => {
    fetch();
    setIsLoading(true);
  }, []);

  return (
    <div className="p-3">
      <Table
        columns={COUPONS_TABLE_COLUMNS({ menuItems })}
        data={data?.coupons || (isLoading ? generateDummyCoupons() : [])}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e)}
        loading={isLoading}
        header={
          <CouponTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        filters={filters}
      />
      <CustomDialog
        onConfirm={deleteItem}
        onHide={() =>
          setIsDeleting({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              discount: 0,
              enabled: false,
              title: '',
              lifeTimeActive: false,
              endDate: '',
              startDate: '',
            },
          })
        }
        visible={isDeleting.bool}
        loading={deleteCouponLoading}
        message={t('Are you sure to delete the coupon?')}
      />
    </div>
  );
}
