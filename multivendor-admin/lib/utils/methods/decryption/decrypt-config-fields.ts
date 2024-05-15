import { IConfiguration } from '../../interfaces';
import { decrypt } from './decrypt';

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];

export const decryptConfigFields = async (
  config: IConfiguration | null | undefined
): Promise<IConfiguration | null | undefined> => {
  if (!config) return config;

  const encryptedKeys: StringKeys<IConfiguration>[] = [
    'password',
    'clientId',
    'clientSecret',
    'publishableKey',
    'secretKey',
    'currency',
    'currencySymbol',
    'twilioAccountSid',
    'twilioAuthToken',
    'twilioPhoneNumber',
    'firebaseKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'msgSenderId',
    'appId',
    'measurementId',
    'vapidKey',
    'sendGridApiKey',
    'sendGridEmail',
    'sendGridEmailName',
    'sendGridPassword',
    'dashboardSentryUrl',
    'webSentryUrl',
    'apiSentryUrl',
    'customerAppSentryUrl',
    'restaurantAppSentryUrl',
    'riderAppSentryUrl',
    'googleApiKey',
    'cloudinaryUploadUrl',
    'cloudinaryApiKey',
    'webClientID',
    'androidClientID',
    'iOSClientID',
    'expoClientID',
    'googleMapLibraries',
    'googleColor',
    'testOtp',
  ];

  const decrypted: IConfiguration = { ...config };

  for (const key of encryptedKeys) {
    if (key && typeof decrypted[key] === 'string') {
      const value = decrypted[key] as string;
      try {
        decrypted[key] = (await decrypt(value)) as string; 
      } catch {
        decrypted[key] = value;
      }
    }
  }

  return decrypted;
};