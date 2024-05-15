
import { IGlobalProviderProps } from "./global.interface";

import { IGlobalProps } from "./global.interface";

export interface ISoundContext extends IGlobalProps {
  playSound: () => void;
  stopSound: () => {};
}

export interface ISoundContextProviderProps extends IGlobalProviderProps {}
