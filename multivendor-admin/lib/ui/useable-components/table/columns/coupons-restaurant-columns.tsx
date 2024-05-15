
import { useContext, useState } from 'react';

import ActionMenu from '@/lib/ui/useable-components/action-menu';
import CustomInputSwitch from '../../custom-input-switch';

import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { ICouponRestaurantResponse } from '@/lib/utils/interfaces/coupons-restaurant.interface';

import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import { useMutation } from '@apollo/client';
import { EDIT_RESTAURANT_COUPON } from '@/lib/api/graphql/mutations/coupons-restaurant';
import { GET_RESTAURANT_COUPONS } from '@/lib/api/graphql/queries/coupons-restaurant';
import { useTranslations } from 'next-intl';


export const COUPONS_RESTAURANT_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICouponRestaurantResponse>['items'];
}) => {

  const t = useTranslations();

  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const [mutateToggle, { loading }] = useMutation(EDIT_RESTAURANT_COUPON, {
    refetchQueries: [{ query: GET_RESTAURANT_COUPONS }],
    awaitRefetchQueries: true,
  });

  const onHandleBannerStatusChange = async (
    enabled: boolean,
    coupon: ICouponRestaurantResponse
  ) => {
    try {
      setSelectedCouponId(coupon._id);
      await mutateToggle({
        variables: {
          restaurantId: restaurantId,
          couponInput: {
            _id: coupon._id,
            title: coupon.title,
            discount: coupon.discount,
            enabled,
          },
        },
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setSelectedCouponId(null);
    }
  };

  return [
    { headerName: t('Name'), propertyName: '__typename' },
    { headerName: t('Code'), propertyName: 'title' },
    { headerName: t('Discount'), propertyName: 'discount' },

    {
      headerName: t('Enabled'),
      propertyName: 'enabled',
      body: (coupon: ICouponRestaurantResponse) => (
        <CustomInputSwitch
          loading={coupon._id === selectedCouponId && loading}
          isActive={coupon.enabled}
          onChange={async () => {
            await onHandleBannerStatusChange(!coupon.enabled, coupon);
          }}
        />
      ),
    },
    {
      propertyName: 'actions',
      body: (coupon: ICouponRestaurantResponse) => (
        <ActionMenu items={menuItems} data={coupon} />
      ),
    },
  ];
};
