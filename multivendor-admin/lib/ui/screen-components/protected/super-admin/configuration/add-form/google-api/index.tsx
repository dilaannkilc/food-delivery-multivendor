'use client';

import { Form, Formik } from 'formik';

import ConfigCard from '../../view/card';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';

import useToast from '@/lib/hooks/useToast';

import { useConfiguration } from '@/lib/hooks/useConfiguration';

import { IGoogleApiForm } from '@/lib/utils/interfaces/configurations.interface';

import { GoogleApiValidationSchema } from '@/lib/utils/schema';

import {
  GET_CONFIGURATION,
  SAVE_GOOGLE_API_KEY_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const GoogleApiAddForm = () => {

  const { GOOGLE_MAPS_KEY } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    googleApiKey: GOOGLE_MAPS_KEY ?? '',
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_GOOGLE_API_KEY_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IGoogleApiForm) => {
    mutate({
      variables: {
        configurationInput: {
          googleApiKey: values.googleApiKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Google API Key Updated',
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
        validationSchema={GoogleApiValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Google API'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4">
                  <CustomPasswordTextField
                    placeholder="Google API Key"
                    name="googleApiKey"
                    maxLength={255}
                    feedback={false}
                    value={values.googleApiKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.googleApiKey && touched.googleApiKey
                          ? 'red'
                          : '',
                    }}
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

export default GoogleApiAddForm;
