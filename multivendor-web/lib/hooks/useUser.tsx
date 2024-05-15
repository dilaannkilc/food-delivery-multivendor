"use client";

import { useContext } from "react";
import UserContext from "../context/User/User.context";


export default function useUser() {

  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  const originalUpdateItemQuantity = context.updateItemQuantity;

  const debugUpdateItemQuantity = (key: string, changeAmount: number) => {

    const safeChangeAmount = changeAmount > 0 ? changeAmount : -1;
    return originalUpdateItemQuantity(key, safeChangeAmount);
  };

  return {
    ...context,
    updateItemQuantity: debugUpdateItemQuantity,
  };
}
