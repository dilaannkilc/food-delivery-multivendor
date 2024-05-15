'use client';

import { useContext, useRef } from 'react';

import {
  IRestaurantContextData,
  IRestaurantsAddFormComponentProps,
} from '@/lib/utils/interfaces';

import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import { RestaurantContext } from '@/lib/context/super-admin/restaurant.context';
import RestaurantDetails from './restaurant-details';
import RestaurantLocation from './restaurant-location';
import RestaurantTiming from './restaurant-timing';
import { useTranslations } from 'next-intl';

const RestaurantsForm = ({
  position = 'right',
}: IRestaurantsAddFormComponentProps) => {

  const t = useTranslations();

  const stepperRef = useRef(null);

  const {
    isRestaurantFormVisible,
    onSetRestaurantFormVisible,
    activeIndex,
    onActiveStepChange,
    onSetRestaurantContextData,
  } = useContext(RestaurantContext);

  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };

  const onSidebarHideHandler = () => {

    onActiveStepChange(0);
    onSetRestaurantFormVisible(false);
    onSetRestaurantContextData({} as IRestaurantContextData);
  };


  return (
    <Sidebar
      visible={isRestaurantFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={t('Add Details')}>
            <RestaurantDetails
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
                isLastStep: false,
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
