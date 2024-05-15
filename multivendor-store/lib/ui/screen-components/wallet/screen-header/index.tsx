
import CustomScreenHeader from "@/lib/ui/useable-components/custom-screen-header";

import { useTranslation } from "react-i18next";

export default function WalletScreenHeader() {

  const { t } = useTranslation();
  return <CustomScreenHeader title={t("Earnings")} />;
}
