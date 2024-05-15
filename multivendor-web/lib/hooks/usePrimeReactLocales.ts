"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { addLocale, locale as setLocale } from "primereact/api";

export function usePrimeReactLocales() {
  const t = useTranslations("Password");

  useEffect(() => {

    
    addLocale("en", {
      weak: t("weak"),
      medium: t("medium"),
      strong: t("strong"),
      passwordPrompt: t("enter_a_password"),
    });

    setLocale("en");
  }, [t]);
}
