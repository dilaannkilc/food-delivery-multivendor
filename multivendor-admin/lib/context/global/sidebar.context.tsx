'use client';

import { createContext, useState } from 'react';

import {
  IProvider,
  ISelectedItems,
  ISidebarContextProps,
} from '@/lib/utils/interfaces';

import {} from '@/lib/utils/interfaces';

export const SidebarContext = createContext<ISidebarContextProps>(
  {} as ISidebarContextProps
);

export const SidebarProvider = ({ children }: IProvider) => {
  const [selectedItem, setSelectedItem] = useState<ISelectedItems | null>(null);

  const onSetSelectedItems = (items: ISelectedItems) => {
    setSelectedItem(items);
  };

  const value: ISidebarContextProps = {
    selectedItem: selectedItem,
    setSelectedItem: onSetSelectedItems,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
