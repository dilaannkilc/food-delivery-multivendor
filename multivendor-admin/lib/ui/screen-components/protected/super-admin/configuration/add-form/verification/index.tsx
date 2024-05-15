'use client';

import { Form, Formik } from 'formik';

import ConfigCard from '../../view/card';

import useToast from '@/lib/hooks/useToast';

import { useConfiguration } from '@/lib/hooks/useConfiguration';

import { IVerificationConfigForm } from '@/lib/utils/interfaces/configurations.interface';

import {
  GET_CONFIGURATION,
  SAVE_VERIFICATION_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

const VerificationAddForm = () => {

  const {
    SKIP_EMAIL_VERIFICATION,
    SKIP_MOBILE_VERIFICATION,
    SKIP_WHATSAPP_OTP,
  } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    skipEmailVerification: SKIP_EMAIL_VERIFICATION ?? false,
    skipMobileVerification: SKIP_MOBILE_VERIFICATION ?? false,
    skipWhatsAppOTP: SKIP_WHATSAPP_OTP ?? false,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_VERIFICATION_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IVerificationConfigForm) => {
    mutate({
      variables: {
        configurationInput: {
          skipEmailVerification: values.skipEmailVerification,
          skipMobileVerification: values.skipMobileVerification,
          skipWhatsAppOTP: values?.skipWhatsAppOTP
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Verification Configurations Updated',
          duration: 3000,
        });
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = 'ActionFailedTryAgain';
        }
        showToast({
          type: 'error',
          title: 'Error!',
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Verification Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4">
                  <CustomInputSwitch
                    label={`Skip Mobile Verification`}
                    onChange={() =>
                      setFieldValue(
                        'skipMobileVerification',
                        !values.skipMobileVerification
                      )
                    }
                    isActive={values.skipMobileVerification}
                    reverse
                  />
                  <CustomInputSwitch
                    label={`Skip Email Verification`}
                    onChange={() =>
                      setFieldValue(
                        'skipEmailVerification',
                        !values.skipEmailVerification
                      )
                    }
                    isActive={values.skipEmailVerification}
                    reverse
                  />
                  <CustomInputSwitch
                    label={`Skip Whatsapp OTP`}
                    onChange={() =>
                      setFieldValue(
                        'skipWhatsAppOTP',
                        !values.skipWhatsAppOTP
                      )
                    }
                    isActive={values.skipWhatsAppOTP}
                    reverse
                  />
                </div>
              </ConfigCard>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default VerificationAddForm;
