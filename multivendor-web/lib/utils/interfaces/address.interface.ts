import { ILocationPointCoordinates } from "./location.interface";

export interface IAddress {
    location?: ILocationPointCoordinates; 
    deliveryAddress: string;
    details?: string;
    label: string;
    selected: boolean;
    isActive: boolean;
  }