import { ListingForm } from '../types';
import { FormFields } from './FormFields';
import { ImageUpload } from './ImageUpload';

interface FormStepsProps {
  step: number;
  listingType: string;
  formData: ListingForm;
  handleChange: (e: any) => void;
  handleAmenitiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: (data: ListingForm) => void;
}

export const FormSteps = ({
  step,
  listingType,
  formData,
  handleChange,
  handleAmenitiesChange,
  setFormData
}: FormStepsProps) => {
  if (step === 1) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <p className="mt-1 text-sm text-gray-500">Enter the basic details about your listing.</p>
        </div>

        <FormFields
          listingType={listingType}
          formData={formData}
          handleChange={handleChange}
          handleAmenitiesChange={handleAmenitiesChange}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Images</h3>
          <p className="mt-1 text-sm text-gray-500">Upload images for your listing.</p>
        </div>

        <ImageUpload
          listingType={listingType}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
          <p className="mt-1 text-sm text-gray-500">Enter your contact details.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="contactName"
              id="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              id="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}; 