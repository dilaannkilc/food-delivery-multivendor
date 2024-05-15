
import { ICustomButtonProps } from '@/lib/utils/interfaces';

import { Button } from 'primereact/button';

import classes from './button.module.css';

export default function CustomButton({
  className,
  label,
  type,
  ...props
}: ICustomButtonProps) {
  return (
    <Button
      className={`${classes['btn-custom']} ${className}`}
      label={label}
      type={type}
      {...props}
    ></Button>
  );
}
