
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";

import PhoneIcon from "@/lib/utils/assets/svg/phone";

import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import CustomButton from "@/lib/ui/useable-components/button";
import { useTranslations } from "next-intl";

export default function SavePhoneNumber() {

  const t = useTranslations();
  const { sendOtpToPhoneNumber, setUser, user, isLoading } = useAuth();
  const {profile}=useUser();
  const { showToast } = useToast();

  const handleChange = (val:string) => {
    setUser((prev) => ({
      ...prev,
      phone: val,
    }))
  }
  const handleSubmit = async () => {
    try {
      if(!user?.phone) {
        showToast({
          type: "error",
          title: t("Error"),
          message: "Please enter a valid phone number",
        });
        return;
      }else if(profile?.phoneIsVerified){
        showToast({
          type: "info",
          title: t("phone_verification"),
          message: t("your_phone_number_already_verified_message"),
        });
        return;
      }else{
        await sendOtpToPhoneNumber(user?.phone)
      }
    } catch (error) {
      console.log(error);
      showToast({
        type: "error",
        title: t("Error"),
        message: t("An error occured while saving the phone number"),
      });
    }
  };
 return (
  <div className="flex flex-col justify-center items-center p-6 w-full text-center dark:bg-gray-900 dark:text-white">
    {}
    <div className="my-2">
      <PhoneIcon  />
    </div>

    {}
    <h2 className="font-bold text-2xl my-2">
      {t("whats_your_mobile_number_label")}
    </h2>

    {}
    <p className="text-gray-600 dark:text-gray-400 my-2 max-w-md">
      {t("we_need_this_to_verify_and_secure_your_account_message")}
    </p>

    {}
    <div className="w-full flex justify-center my-3">
      <CustomPhoneTextField
        mask="999 999 999 999"
        name="phone"
        showLabel={false}
        type="text"

        value={user?.phone}
        onChange={handleChange}
      />
    </div>

    {}
    <CustomButton
      className="bg-primary-color flex items-center justify-center gap-x-4 px-4 py-3 rounded-full w-72 my-3 text-white font-medium shadow-sm"
      onClick={handleSubmit}
      loading={isLoading}
      label={t("continue_label")}
    />
  </div>
);

}
