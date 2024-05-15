
import CustomButton from '@/lib/ui/useable-components/button';

import { Card } from 'primereact/card';

export default function PhoneVerificationMain() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-2/6">
        <Card>
          <div className="mb-2 flex flex-col p-2">
            <i className="pi pi-mobile mb-4" style={{ fontSize: '50px' }} />
            <span className="text-3xl">What&apos;s your mobile number?</span>
            <span className="text-sm text-gray-400">
              We need this to verify and secure your account.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {}{' '}
            {}
            <CustomButton
              className="h-12 w-full border-primary-color bg-primary-color text-white hover:bg-white hover:text-primary-color"
              label="Continue"
              rounded={true}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
