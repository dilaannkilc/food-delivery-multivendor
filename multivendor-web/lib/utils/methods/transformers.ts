import { ICategoryDetailsResponse } from "../interfaces";

export const transformCategoryDetailsResponse = (
  backendData: ICategoryDetailsResponse[]
) => {
  return backendData.map((item) => ({
    label: item.label,
    url: item.url,


    items:
      item.items?.map((subItem) => ({
        label: subItem.label,
        url: subItem.url,

      })) || [],
  }));
};
