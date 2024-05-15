
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICoupon } from '@/lib/utils/interfaces/coupons.interface';

import CustomInputSwitch from '../../custom-input-switch';
import ActionMenu from '../../action-menu';

import { useContext, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

import { EDIT_COUPON, GET_COUPONS } from '@/lib/api/graphql';

import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';

export const COUPONS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICoupon>['items'];
}) => {

  const { showToast } = useContext(ToastContext);

  const t = useTranslations();

  const [editCouponLoading, setEditCouponLoading] = useState({
    _id: '',
    bool: false,
  });

  const [editCoupon, { loading }] = useMutation(EDIT_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }],
    onCompleted: () => {
      showToast({
        title: t('Edit Coupon'),
        type: 'success',
        message: t('Coupon Status has been edited successfully'),
        duration: 2500,
      });
      setEditCouponLoading({
        _id: '',
        bool: false,
      });
    },
    onError: (err) => {
      showToast({
        title: t('Edit Coupon'),
        type: 'error',
        message:
          err.message ||
          err?.cause?.message ||
          t('Something went wrong, please try again'),
        duration: 2500,
      });
      setEditCouponLoading({
        bool: false,
        _id: '',
      });
    },
  });

  async function handleEnableField(rowData: ICoupon) {
    setEditCouponLoading({
      bool: true,
      _id: rowData._id,
    });
    const updatedCoupon = {
      _id: rowData?._id,
      title: rowData?.title,
      discount: rowData?.discount,
      enabled: !rowData?.enabled,
      lifeTimeActive: rowData?.lifeTimeActive,
      startDate: rowData?.startDate,
      endDate: rowData?.endDate,
    };
    await editCoupon({
      variables: {
        couponInput: updatedCoupon,
      },
    });
  }

  const coupon_columns = useMemo(
    () => [
      {
        headerName: t('Name'),
        propertyName: '__typename',
      },
      {
        headerName: t('Code'),
        propertyName: 'title',
      },
      {
        headerName: t('Discount'),
        propertyName: 'discount',
        body: (rowData: ICoupon) => {
          return <span>{rowData.discount}%</span>;
        },
      },
      {
        headerName: t('lifetime_active'),
        propertyName: 'lifeTimeActive',
        body: (rowData: ICoupon) => {
          return <span>{rowData.lifeTimeActive ? t('Yes') : t('No')}</span>;
        },
      },
      {
        headerName: t('Start Date'),
        propertyName: 'startDate',
        body: (rowData: ICoupon) => {
          if (rowData.lifeTimeActive) return <span>{t('Lifetime')}</span>;
          return (
            <span>
              {rowData.startDate
                ? new Date(Number(rowData.startDate)).toLocaleDateString()
                : '-'}{' '}
            </span>
          );
        },
      },
      {
        headerName: t('End Date'),
        propertyName: 'endDate',
        body: (rowData: ICoupon) => {
          if (rowData.lifeTimeActive) return <span>{t('Lifetime')}</span>;
          return (
            <span>
              {rowData.endDate
                ? new Date(Number(rowData.endDate)).toLocaleDateString()
                : '-'}
            </span>
          );
        },
      },
      {
        headerName: t('Status'),
        propertyName: 'enabled',
        body: (rowData: ICoupon) => {
          return (
            <div className="flex w-full cursor-pointer items-center justify-between gap-2">
              <div className="flex w-20 items-start">
                <CustomInputSwitch
                  isActive={rowData.enabled}
                  className={
                    rowData?.enabled
                      ? 'p-inputswitch-checked absolute'
                      : 'absolute'
                  }
                  onChange={() => handleEnableField(rowData)}
                  loading={rowData._id === editCouponLoading._id && loading}
                />
              </div>
              <ActionMenu data={rowData} items={menuItems} />
            </div>
          );
        },
      },
    ],
    [loading, editCouponLoading.bool, menuItems]
  );
  return coupon_columns;
};
