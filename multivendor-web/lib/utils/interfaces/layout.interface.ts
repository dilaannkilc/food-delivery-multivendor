import React, {
  Dispatch,
  HTMLAttributeAnchorTarget,
  SetStateAction,
} from "react";

import { IGlobalProps } from "./global.interface";

export interface IProvider extends IGlobalProps {}


export type LayoutState = {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
};

export type LayoutConfig = {
  ripple: boolean;
  inputStyle: string;
  menuMode: string;
  colorScheme: string;
  theme: string;
  scale: number;
};

export interface MenuContextProps {
  activeMenu: string;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}


export interface AppConfigProps {
  simple?: boolean;
}

export interface AppTopbarRef {
  menubutton?: HTMLButtonElement | null;
  topbarmenu?: HTMLDivElement | null;
  topbarmenubutton?: HTMLButtonElement | null;
}


type CommandProps = {
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;

  item: string;
};

export interface MenuProps {
  model: MenuModel[];
}

export interface MenuModel {
  label: string;
  icon?: string;
  items?: MenuModel[];
  to?: string;
  url?: string;
  target?: HTMLAttributeAnchorTarget;
  seperator?: boolean;
}

export interface AppMenuItem extends MenuModel {
  items?: AppMenuItem[];
  badge?: "UPDATED" | "NEW";
  badgeClass?: string;
  class?: string;
  preventExact?: boolean;
  visible?: boolean;
  disabled?: boolean;
  replaceUrl?: boolean;
  command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
  item?: AppMenuItem;
  parentKey?: string;
  index?: number;
  root?: boolean;
  className?: string;
}


export interface IPaddingContainer extends IGlobalProps {
  height?: string;
  style?: React.CSSProperties;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  className?: string;
}


export interface IProtectedHomeLayoutComponent extends IGlobalProps {}


export interface IProtectedProfileLayoutComponent extends IGlobalProps {}


export interface IProfileTabsProps {
  className?: string
}
export interface ITabItem {
  label: string;
  path: string
}