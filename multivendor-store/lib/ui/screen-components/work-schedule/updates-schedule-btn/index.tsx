
import { CustomContinueButton } from "@/lib/ui/useable-components";

import { useTranslation } from "react-i18next";

export default function UpdateScheduleBtn({
  onHandlerSubmit,
  isUpatingSchedule,
}: {
  onHandlerSubmit: () => Promise<void>;
  isUpatingSchedule: boolean;
  width: number;
}) {

  const { t } = useTranslation();

  return (
    <CustomContinueButton
      title={t("Update Schedule")}
      onPress={onHandlerSubmit}
      isLoading={isUpatingSchedule}
    />
  );
}
