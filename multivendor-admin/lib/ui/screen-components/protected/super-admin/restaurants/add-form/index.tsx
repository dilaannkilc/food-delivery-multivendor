'use client';

import { useContext, useMemo, useRef } from 'react';

import { GET_VENDORS } from '@/lib/api/graphql';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

import {
  IQueryResult,
  IRestaurantsAddFormComponentProps,
  IRestaurantsContextPropData,
  IVendorReponse,
  IVendorResponseGraphQL,
} from '@/lib/utils/interfaces';

import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import RestaurantDetailsForm from './restaurant-details';
import RestaurantLocation from './restaurant-location';
import VendorDetails from './vendor-details';
import RestaurantTiming from './restaurant-timing';
import { useTranslations } from 'next-intl';

const RestaurantsForm = ({
  position = 'right',
}: IRestaurantsAddFormComponentProps) => {

  const t = useTranslations();

  const stepperRef = useRef(null);

  const {
    isRestaurantsFormVisible,
    onRestaurantsFormVisible,
    activeIndex,
    onActiveStepChange,
    onSetRestaurantsContextData,
  } = useContext(RestaurantsContext);

  const vendorResponse = useQueryGQL(
    GET_VENDORS,
    { fetchPolicy: 'network-only' },
    {
      debounceMs: 300,
    }
  ) as IQueryResult<IVendorResponseGraphQL | undefined, undefined>;

  const vendorsDropdown = useMemo(
    () =>
      vendorResponse?.data?.vendors?.map((vendorItem: IVendorReponse) => {
        return { label: vendorItem.email, code: vendorItem._id };
      }),
    [vendorResponse?.data?.vendors]
  );

  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };
  const onSidebarHideHandler = () => {

    onActiveStepChange(0);
    onRestaurantsFormVisible(false);
    onSetRestaurantsContextData({} as IRestaurantsContextPropData);
  };


  return (
    <Sidebar
      visible={isRestaurantsFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={t('Set Vendor')}>
            <VendorDetails
              vendorsDropdown={vendorsDropdown ?? []}
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header={t('Add Details')}>
            <RestaurantDetailsForm
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header={t('Location')}>
            <RestaurantLocation
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
          <StepperPanel header={t('Timing')}>
            <RestaurantTiming
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default RestaurantsForm;
