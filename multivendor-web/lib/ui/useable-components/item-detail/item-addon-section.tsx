
import { AddonSectionProps } from "@/lib/utils/interfaces";



export const ItemDetailAddonSection = <
  T extends {
    _id: string;
    options?: {
      _id: string;
      title: string;
      description: string;
      price: number;
    }[];
    title?: string;
    description?: string;
    quantityMinimum?: number;
    quantityMaximum?: number;
  },
>({
  title,
  addonOptions,
  name,



}: AddonSectionProps<T>): React.JSX.Element => {
  return (
    <div className="mb-4">
      <h3 className="font-inter font-bold text-[14px] md:text-[16px] lg:text-[18px] leading-[20px] md:leading-[22px]">
        {title}
      </h3>
      <div className="mt-2 space-y-2">
        {addonOptions?.options?.map((option) => (
          <label
            key={option._id}
            className="flex items-center gap-x-2 w-full cursor-pointer"
          >
            {}
            <input
              type={
                (
                  addonOptions.quantityMaximum === 1
                ) ?
                  "radio"
                  : "checkbox"
              }
              name={name}

            />

            {}
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-gray-900">{option.title}</span>
              <span className="text-sm text-gray-700">${option.price}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
