'use client';

import { useContext, useRef } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import { FoodsContext } from '@/lib/context/restaurant/foods.context';

import { IFoodAddFormComponentProps } from '@/lib/utils/interfaces';

import FoodDetails from './food.index';
import VariationAddForm from './variations';
import { useTranslations } from 'next-intl';

const FoodForm = ({ position = 'right' }: IFoodAddFormComponentProps) => {

  const t = useTranslations();

  const stepperRef = useRef(null);

  const {
    activeIndex,
    isFoodFormVisible,
    onClearFoodData,
    onActiveStepChange,
  } = useContext(FoodsContext);

  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };

  const onSidebarHideHandler = () => {
    onClearFoodData();
  };

  return (
    <Sidebar
      visible={isFoodFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={t('Add Product')}>
            <FoodDetails
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
              isFoodFormVisible={isFoodFormVisible}
            />
          </StepperPanel>
          <StepperPanel header={t('Add Variations')}>
            <VariationAddForm
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default FoodForm;
