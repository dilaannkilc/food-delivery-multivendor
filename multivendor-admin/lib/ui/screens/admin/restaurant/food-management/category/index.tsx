
import { useContext, useState } from 'react';

import CategoryAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-form';
import CategoryHeader from '@/lib/ui/screen-components/protected/restaurant/category/view/header/screen-header';
import CategoryMain from '@/lib/ui/screen-components/protected/restaurant/category/view/main';
import SubCategoriesAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-subcategories';

import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

export default function CategoryScreen() {

  const {
    isAddSubCategoriesVisible,
    setIsAddSubCategoriesVisible,
    category,
    setCategory,
    subCategories,
    setSubCategories,
  } = useContext(RestaurantLayoutContext);

  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);

  return (
    <div className="screen-container">
      <CategoryHeader setIsAddCategoryVisible={setIsAddCategoryVisible} />

      <CategoryMain
        setIsAddCategoryVisible={setIsAddCategoryVisible}
        setIsAddSubCategoriesVisible={setIsAddSubCategoriesVisible}
        setCategory={setCategory}
        setSubCategories={setSubCategories}
      />
      {}
      <SubCategoriesAddForm
        onHide={() => {
          setIsAddSubCategoriesVisible({
            bool: false,
            parentCategoryId: '',
          });
          setCategory(null);
          setSubCategories([]);
        }}
        isAddSubCategoriesVisible={isAddSubCategoriesVisible}
        category={category}
      />
      {}
      <CategoryAddForm
        category={category}
        subCategories={subCategories}
        onHide={() => {
          setIsAddCategoryVisible(false);
          setCategory(null);
          setSubCategories([]);
        }}
        isAddCategoryVisible={isAddCategoryVisible}
      />
    </div>
  );
}
