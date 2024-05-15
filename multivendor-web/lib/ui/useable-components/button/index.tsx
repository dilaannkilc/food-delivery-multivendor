
import { ICustomButtonProps } from "@/lib/utils/interfaces";

import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";



export default function CustomButton({
  className,
  label,
  type,
  loading,
  ...props
}: ICustomButtonProps) {
  return (
    <Button
      loading={loading}
      disabled={loading}
      className={twMerge("shadow-none text-sm", className)}

      label={label}
      type={type}
      {...props}
    ></Button>
  );
}
