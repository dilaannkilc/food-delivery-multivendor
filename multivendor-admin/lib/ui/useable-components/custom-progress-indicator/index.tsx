
import React from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';

import { CustomProgressIndicatorComponentProps } from '@/lib/utils/interfaces';

const CustomLoader: React.FC<CustomProgressIndicatorComponentProps> = ({
  size = '20px',
  strokeWidth = '5', 
  animationDuration = '.5s',
}) => {
  return (
    <ProgressSpinner
      style={{ width: size, height: size, color: 'green' }}
      strokeWidth={strokeWidth}
      fill={'transparent'}
      animationDuration={animationDuration}
    />
  );
};

export default CustomLoader;
