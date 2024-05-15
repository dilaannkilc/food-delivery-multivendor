import { IOrder } from "./orders.interface";

export interface IRatingModalProps {
  visible: boolean; 
  onHide: () => void; 
  order: IOrder | null; 
  onSubmitRating: (
    orderId: string | undefined,
    rating: number,
    comment?: string,
    aspects?: string[]
  ) => void; 
}

export interface IRenderStepTwoProps {
  selectedAspects: string[];
  handleAspectToggle: (aspect: string) => void;
  handleNext: () => void;
  handleSubmitDebounced: () => void;
}

export interface IRenderStepThreeProps {
    selectedAspects: string[];         
    handleAspectToggle: (aspect: string) => void;
    handleSubmitDebounced: () => void;
    comment: string;
    setComment: (value: string) => void;
  }


export interface IRatingOption {
  value: number;                  
  emoji: string;                  
  label: string;                  
  selected: boolean;              
  onSelect: (value: number) => void; 
}