'use client';

import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';

import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';

import {
  ICategory,
  ICategoryByRestaurantResponse,
  IDropdownSelectItem,
  IFoodDetailsComponentProps,
  IFoodNew,
  IQueryResult,
  ISubCategory,
  ISubCategoryByParentIdResponse,
} from '@/lib/utils/interfaces';
import { IFoodDetailsForm } from '@/lib/utils/interfaces/forms/food.form.interface';

import { FoodErrors, MAX_LANSDCAPE_FILE_SIZE } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

import CategoryAddForm from '../../../category/add-form';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

import { GET_CATEGORY_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';

import { FoodSchema } from '@/lib/utils/schema';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import { faAdd } from '@fortawesome/free-solid-svg-icons';

import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import InputSkeleton from '@/lib/ui/useable-components/custom-skeletons/inputfield.skeleton';
import { useTheme } from 'next-themes';

const initialValues: IFoodDetailsForm = {
  _id: null,
  title: '',
  description: '',
  image: '',
  category: null,
  subCategory: null,
};
export default function FoodDetails({
  stepperProps,
}: IFoodDetailsComponentProps) {

  const t = useTranslations();
  const { theme } = useTheme();

  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    type: '',
    order: -1,
  };

  const { onSetFoodContextData, foodContextData } = useContext(FoodsContext);
  const { isAddSubCategoriesVisible, setIsAddSubCategoriesVisible } =
    useContext(RestaurantLayoutContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [subCategories] = useState<ISubCategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    IDropdownSelectItem[]
  >([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [categoryDropDown, setCategoryDropDown] =
    useState<IDropdownSelectItem>();
  const [foodInitialValues, setFoodInitialValues] = useState(
    foodContextData?.isEditing || foodContextData?.food?.data?.title
      ? { ...initialValues, ...foodContextData?.food?.data }
      : { ...initialValues }
  );

  const {
    data,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQueryGQL(
    GET_CATEGORY_BY_RESTAURANT_ID,
    { id: restaurantId ?? '' },
    {
      fetchPolicy: 'no-cache',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<ICategoryByRestaurantResponse | undefined, undefined>;

  const {
    data: subCategoriesData,
    loading: subCategoriesLoading,
    refetch: refetchSubCategories,
  } = useQueryGQL(
    GET_SUBCATEGORIES_BY_PARENT_ID,
    {
      parentCategoryId: categoryDropDown?.code,
    },
    {
      enabled: !!categoryDropDown?.code,
      fetchPolicy: 'cache-and-network',
    }
  ) as IQueryResult<
    ISubCategoryByParentIdResponse | undefined,
    { parentCategoryId: string }
  >;

  const categoriesDropdown = useMemo(
    () =>
      data?.restaurant?.categories.map((category: ICategory) => {
        return { label: category.title, code: category._id };
      }),
    [data?.restaurant?.categories]
  );

  const subCategoriesDropdown = useMemo(
    () =>
      subCategoriesData?.subCategoriesByParentId.map(
        (sub_category: ISubCategory) => {
          return { label: sub_category.title, code: sub_category._id };
        }
      ),
    [categoryDropDown?.code, subCategoriesData]
  );

  const onFoodSubmitHandler = (values: IFoodDetailsForm) => {
    const foodData: IFoodNew = {
      _id: foodContextData?.food?.data?._id ?? '',
      title: values.title,
      description: values.description,
      category: values.category,
      subCategory: values.subCategory,
      image: values.image,
      isOutOfStock: false,
      isActive: true,
      __typename: foodContextData?.food?.data?.__typename ?? 'Food',
      variations:
        (foodContextData?.food?.variations ?? []).length > 0
          ? (foodContextData?.food?.variations ?? [])
          : [],
    };

    onSetFoodContextData({
      food: {
        _id: '',
        data: foodData,
        variations:
          (foodContextData?.food?.variations ?? []).length > 0
            ? (foodContextData?.food?.variations ?? [])
            : [],
      },
    });
    onStepChange(order + 1);
  };

  useEffect(() => {
    if (categoryDropDown) {
      const selectedSubCategory: IDropdownSelectItem[] =
        subCategoriesData?.subCategoriesByParentId
          .filter((sub_ctg) => sub_ctg.parentCategoryId)
          .map((sub_ctg_: ISubCategory) => ({
            code: sub_ctg_?._id || '',
            label: sub_ctg_?.title || '',
          })) || [];
      setSelectedSubCategories(selectedSubCategory);
    }

    refetchCategories();
    refetchSubCategories({
      parentCategoryId: categoryDropDown?.code ?? '',
    });
  }, [
    categoryDropDown,
    setIsAddSubCategoriesVisible,
    isAddSubCategoriesVisible,
    subCategoriesData,
  ]);

  useEffect(() => {
    if (foodContextData?.isEditing) {
      const editing_category = categoriesDropdown?.find(
        (_category) =>
          _category.code === foodContextData?.food?.data.category?.code
      );
      setFoodInitialValues({
        ...JSON.parse(JSON.stringify(foodInitialValues)),
        category: editing_category,
      });
      setCategoryDropDown(editing_category ?? ({} as IDropdownSelectItem));
    }
  }, [categoriesDropdown]);

  return (
    <div className="w-full h-full flex items-center justify-start dark:text-white dark:bg-dark-950">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={foodInitialValues}
              validationSchema={FoodSchema}
              enableReinitialize={true}
              onSubmit={async (values) => {
                onFoodSubmitHandler(values);
              }}
              validateOnChange={false}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="category"
                          className="text-sm font-[500]"
                        >
                          {t('Category')}
                        </label>
                        <Dropdown
                          name="category"
                          value={values.category}
                          placeholder={t('Select Category')}
                          className="md:w-20rem m-0 h-10 w-full border dark:text-white dark:bg-dark-950 border-gray-300 dark:border-dark-600 p-0 align-middle text-sm focus:shadow-none focus:outline-none"
                          panelClassName="border-gray-200 border-2"
                          onChange={(e: DropdownChangeEvent) => {
                            handleChange(e);
                            setCategoryDropDown(e.value);
                          }}
                          options={categoriesDropdown ?? []}
                          loading={categoriesLoading}
                          panelFooterTemplate={() => {
                            return (
                              <div className="flex justify-between space-x-2">
                                <TextIconClickable
                                  className="w-full h-fit rounded  text-black dark:text-white"
                                  icon={faAdd}
                                  iconStyles={theme === 'dark' ? { color: 'white' } : { color: 'black' }}
                                  title={t('Add New Category')}
                                  onClick={() => setIsAddCategoryVisible(true)}
                                />
                              </div>
                            );
                          }}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'category',
                              errors?.category,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        {!subCategoriesLoading ? (
                          <CustomDropdownComponent
                            name="subCategory"
                            placeholder={t('Select Sub-Category')}
                            showLabel={true}
                            extraFooterButton={{
                              onChange: () => {
                                setIsAddSubCategoriesVisible((prev) => ({
                                  bool: !prev.bool,
                                  parentCategoryId:
                                    values?.category?.code ?? '',
                                }));
                                refetchSubCategories({
                                  parentCategoryId:
                                    values?.category?.code ||
                                    categoryDropDown?.code ||
                                    '',
                                });
                              },
                              title: t('Add Sub-Category'),
                            }}
                            selectedItem={values.subCategory}
                            setSelectedItem={setFieldValue}
                            options={
                              subCategoriesDropdown ??
                              selectedSubCategories ??
                              []
                            }
                            isLoading={subCategoriesLoading}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'subCategory',
                                errors?.subCategory,
                                FoodErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        ) : (
                          <InputSkeleton />
                        )}
                      </div>

                      <div>
                        <CustomTextField
                          type="text"
                          name="title"
                          placeholder={t('Title')}
                          maxLength={35}
                          value={values.title}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'title',
                              errors?.title,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomTextAreaField
                          name="description"
                          label={t('Description')}
                          placeholder={t('Description')}
                          value={values.description}
                          onChange={handleChange}
                          showLabel={true}
                          className={''}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'description',
                              errors.description,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomUploadImageComponent
                          key="image"
                          name="image"
                          title={t('Upload Image')}
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={841}
                          maxFileWidth={1980}
                          maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                          orientation="LANDSCAPE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.image}
                          showExistingImage={
                            foodContextData?.isEditing ? true : false
                          }
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <CustomButton
                        className="w-fit h-10 border dark:border-dark-600 bg-black text-white border-gray-300 px-8"
                        label={t('Next')}
                        type="submit"
                        loading={isSubmitting}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>

      <CategoryAddForm
        category={category}
        onHide={() => {
          setIsAddCategoryVisible(false);
          setCategory(null);
        }}
        isAddCategoryVisible={isAddCategoryVisible}
        subCategories={subCategories}

        onCategoryAdded={() => {
          refetchCategories();
        }}
      />
    </div>
  );
}
