"use client";

import {
  IUpdateUserPhoneArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";

import { useAuth } from "@/lib/context/auth/auth.context";
import { useEffect, useState } from "react";
import useVerifyOtp from "@/lib/hooks/useVerifyOtp";
import { useTranslations } from "next-intl";

import useToast from "@/lib/hooks/useToast";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import PhoneEntry from "./phone";
import VerificationPhone from "./verification-phone";

import { GET_USER_PROFILE, UPDATE_USER } from "@/lib/api/graphql";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";

export interface IUpdatePhoneModalProps {
  isUpdatePhoneModalVisible: boolean
  handleUpdatePhoneModal: () => void,
  ActiveStep?: number,
  setActiveStep: (step: number) => void
  userPhone?: string
}

export default function UpdatePhoneModal({
  isUpdatePhoneModalVisible,
  handleUpdatePhoneModal,
  ActiveStep,
  setActiveStep,
  userPhone

  
}: IUpdatePhoneModalProps) {

  const [phoneOtp, setPhoneOtp] = useState("");


  const { sendOtpToPhoneNumber, setUser, user, setOtp, checkPhoneExists } = useAuth();
  const { showToast } = useToast();
  const { verifyOTP, error } = useVerifyOtp();
  const t = useTranslations();


   const [
      fetchProfile
    ] = useLazyQuery(GET_USER_PROFILE, {
      fetchPolicy: "network-only",
    });

    const [updateUser] = useMutation<
      IUpdateUserResponse,
      undefined | IUpdateUserPhoneArguments
    >(UPDATE_USER, {
      onError: (error: ApolloError) => {
        showToast({
          type: "error",
          title:             t('update_phone_name_update_error_title'),

          message:
            error.cause?.message ||
            t('update_phone_name_update_error_msg'),
        });
      },
    });

  const handleChange = (val:string) => {
    setUser((prev) => ({
      ...prev,
      phone: val,
    }))
  }

 const handleSubmit = useDebounceFunction(async () => { 
  try {
    if(!user?.phone || user?.phone.length < 7) {
      showToast({
        type: "error",
        title: t("update_phone_name_update_error_title"),
        message: t("update_phone_name_invalid_number"),
      });
      return;
    }
    const phoneExists = await checkPhoneExists(user?.phone);


    if (!phoneExists) {
      await sendOtpToPhoneNumber(user?.phone || "");
      setActiveStep(1);
    }

    
  } catch (error) {
    showToast({
      type: "error",
      title: t("update_phone_name_update_error_title"),
      message: t("update_phone_name_send_otp_error"),
    });
  }
},
  500, 
)

    const handleSubmitAfterVerification = useDebounceFunction(async () => {
      try {
        const otpResponse = await verifyOTP({
          variables: {
            otp:phoneOtp,
            phone: user?.phone
          }
        })
        if (otpResponse.data?.verifyOtp && !!user?.phone) {
          const args = {
            phone: user?.phone,
            name: user?.name ?? "",
            phoneIsVerified: true,
          };
          
          await updateUser({
            variables: args,
          });
          setOtp("");
          setPhoneOtp("");
          setActiveStep(0);
          handleUpdatePhoneModal();
          fetchProfile();
          return showToast({
            type: "success",
            title: t("update_phone_name_verification_success_title"),
            message: t("update_phone_name_verification_success_msg"),
          });
         
        } else {
          showToast({
            type: "error",
            title: t("update_phone_name_otp_error_title"),
            message: t("update_phone_name_otp_error_msg"),
          });
        }
      } catch (error) {
        console.error(
          "Error while updating user and phone otp verification:",
          error,
        );
      }
    },
      500, 
  )
  
    const handleResendPhoneOtp = useDebounceFunction(() => {
      if (user?.phone) {
        sendOtpToPhoneNumber(user?.phone);
      } else {
        showToast({
          type: "error",
          title: t("update_phone_name_update_error_title"),
          message: t("update_phone_name_resend_error_msg")
        });
      }
    },
      500, 
    )

    useEffect(() => {
      if (error) {
        showToast({
          type: "error",
          title: t("otp_error_label"),
          message: t("invalid_otp"),
        });
    }
  }, [error])


  return(
     <CustomDialog visible={isUpdatePhoneModalVisible} onHide={handleUpdatePhoneModal} width="600px" >  
        {
            ActiveStep === 0 ? (
            <PhoneEntry
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                user={user}
                userPhone={userPhone}
                handleUpdatePhoneModal={handleUpdatePhoneModal}
            />
            ) : (
               <VerificationPhone
                handleSubmitAfterVerification={handleSubmitAfterVerification}
                handleResendPhoneOtp={handleResendPhoneOtp}
                phoneOtp={phoneOtp}
                setPhoneOtp={setPhoneOtp}
                user={user}
                showToast={showToast}
               />
            )
        } 
     </CustomDialog>
  )

}
