'use client';

import { Form, Formik } from 'formik';

import ConfigCard from '../../view/card';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

import useToast from '@/lib/hooks/useToast';

import { useConfiguration } from '@/lib/hooks/useConfiguration';

import { IAppConfigForm } from '@/lib/utils/interfaces/configurations.interface';

import { AppConfigValidationSchema } from '@/lib/utils/schema';

import { GET_CONFIGURATION, SAVE_APP_CONFIGURATION } from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const AppConfigAddForm = () => {

  const { APP_TERMS, APP_PRIVACY, APP_TEST_OTP } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    termsAndConditions: APP_TERMS ?? '',
    privacyPolicy: APP_PRIVACY ?? '',
    testOtp: APP_TEST_OTP ? +APP_TEST_OTP : null,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_APP_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IAppConfigForm) => {
    mutate({
      variables: {
        configurationInput: {
          termsAndConditions: values.termsAndConditions,
          privacyPolicy: values.privacyPolicy,
          testOtp: values.testOtp?.toString(),
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'App Configurations Updated',
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
        validationSchema={AppConfigValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          setFieldValue,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'App Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {}
                  <CustomTextField
                    type="text"
                    placeholder="Terms and Conditions"
                    name="termsAndConditions"
                    maxLength={255}
                    value={values.termsAndConditions}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.termsAndConditions && touched.termsAndConditions
                          ? 'red'
                          : '',
                    }}
                  />

                  {}
                  <CustomTextField
                    type="text"
                    placeholder="Privacy Policy"
                    name="privacyPolicy"
                    maxLength={255}
                    value={values.privacyPolicy}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.privacyPolicy && touched.privacyPolicy
                          ? 'red'
                          : '',
                    }}
                  />

                  {}
                  <CustomNumberField
                    min={0}
                    placeholder="Test OTP"
                    name="testOtp"
                    value={values.testOtp}
                    showLabel={true}
                    onChange={setFieldValue}
                    style={{
                      borderColor:
                        errors.testOtp && touched.testOtp ? 'red' : '',
                    }}
                    useGrouping={false}
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

export default AppConfigAddForm;
