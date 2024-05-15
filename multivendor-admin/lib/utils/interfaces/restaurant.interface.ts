import {
  IGlobalComponentProps,
  IQueryResult,
  IStepperFormProps,
} from './global.interface';

export interface IAddRestaurantComponentProps extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}
export interface IRestaurantCardProps extends IGlobalComponentProps {
  restaurant: IRestaurantByOwner;
}

export interface IRestaurantContextProps {

  vendorId: string | null;
  restaurantContextData: IVendorLayoutRestaurantContextData;
  restaurantByOwnerResponse: IQueryResult<
    IRestaurantsByOwnerResponseGraphQL | undefined,
    undefined
  >;

  isRestaurantFormVisible: boolean;
  onSetRestaurantFormVisible: (status: boolean) => void;

  activeIndex: number;
  onActiveStepChange: (activeStep: number) => void;
  onClearRestaurntsData: () => void;

  onSetRestaurantContextData: (data: Partial<IRestaurantContextData>) => void;
  isRestaurantModifed: boolean;
  setRestaurantModifed: (status: boolean) => void;
}

export interface IRestaurantContextData {
  id: string | null;
  filtered: IRestaurantByOwner[] | undefined;
  globalFilter: string;
  isEditing: boolean;
  autoCompleteAddress: string;
  unique_restaurant_id: string;
}

export interface IVendorLayoutRestaurantContextData {
  id: string | null;
  filtered: IRestaurantByOwner[] | undefined;
  globalFilter: string;
  isEditing: boolean;
  autoCompleteAddress: string;
}

export interface IRestaurantResponse {
  _id: string;
  unique_restaurant_id: string;
  name: string;
  image: string;
  orderPrefix: string;
  slug: string;
  address: string;
  deliveryTime: number;
  minimumOrder: number;
  isActive: boolean;
  commissionRate: number;
  tax: number;
  username: string;
  owner: {
    _id: string;
    email: string;
    isActive: boolean;
    __typename: string;
  };
  shopType: string;
  __typename: string;
}

export interface ICommissionRateRestaurantResponse {
  _id: string;
  unique_restaurant_id: string;
  orderId: string;
  orderPrefix: string;
  name: string;
  commissionRate: number;
}

export interface IPaginatedRestaurantResponse {
  data: IRestaurantResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface IRestaurantsResponseGraphQL {
  restaurants?: IPaginatedRestaurantResponse;
  getClonedRestaurants?: IPaginatedRestaurantResponse;
  restaurantsPaginated?: IPaginatedRestaurantResponse;
  getClonedRestaurantsPaginated?: IPaginatedRestaurantResponse;
}

export interface IRestaurantsTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedActions: string[];
  setSelectedActions: (actions: string[]) => void;
}

export interface IDeliveryInfo {
  minDeliveryFee: number;
  deliveryFee: number;
  deliveryDistance: number;
}

export interface IRestaurantByOwner {
  _id: string;
  unique_restaurant_id: string;
  orderId: string;
  orderPrefix: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  isActive: boolean;
  username: string;
  password: string;
  deliveryTime: number;
  minimumOrder: number;
  deliveryInfo: IDeliveryInfo;
  location: {
    coordinates: number[];
  };
  shopType: string;
}

export interface IRestaurantsByOwnerResponseGraphQL {
  restaurantByOwner: {
    _id: string;
    email: string;
    userType: string;
    restaurants: IRestaurantByOwner[];
  };
}

export interface ICreateRestaurant {
  _id: string;
  address: string;
  cuisines: string[];
  image: string;
  phone: string;
  location: {
    __typename: string;
    coordinates: number[];
  };
  logo: string;
  minimumOrder: number;
  name: string;
  orderId: number;
  orderPrefix: string;
  password: string;
  shopType: string;
  slug: string;
  tax: number;
  username: string;
  __typename: string;
  deliveryTime: number;
  isActive: boolean;
  commissionRate: number;
  owner: {
    _id: string;
    email: string;
    isActive: boolean;
    __typename: string;
  };
}

export interface ICreateRestaurantResponse {
  data?: {
    createRestaurant?: ICreateRestaurant;
  };
}


export interface IRestaurantProfile {
  _id: string;
  orderId: number;
  orderPrefix: string;
  slug: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  location: {
    coordinates: string[];
    __typename: string;
  };
  deliveryBounds: {
    coordinates: number[][][];
    __typename: string;
  };
  username: string;
  password: string;
  deliveryTime: number;
  minimumOrder: number;
  tax: number;
  isAvailable: boolean;
  stripeDetailsSubmitted: boolean;
  openingTimes: {
    day: string;
    times: {
      startTime: string[];
      endTime: string[];
      __typename: string;
    }[];
    __typename: string;
  }[];
  owner: {
    _id: string;
    email: string;
    __typename: string;
  };
  shopType: string;
  cuisines: string[];
  __typename: string;
}
export interface IRestaurantProfileResponse {
  data: {
    restaurant: IRestaurantProfile;
  };
}

export interface IRestaurantProfileResponseGQL {
  restaurant: IRestaurantProfile;
}

export interface IRestaurantDeliveryZoneInfo {
  boundType: string;
  deliveryBounds: {
    coordinates: number[][][];
    __typename: string;
  };
  location: {
    coordinates: number[];
    __typename: string;
  };
  circleBounds: {
    radius: number;
    __typename: string;
  };
  address: string;
  city: string;
  postCode: string;
  __typename: string;
}

export interface IRestaurantDeliveryZoneInfoResponse {
  data: {
    getRestaurantDeliveryZoneInfo: IRestaurantDeliveryZoneInfo;
  };
}