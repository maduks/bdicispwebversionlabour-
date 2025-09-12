import { ListingForm } from '../types';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  BUSINESS_INDUSTRIES,
  BUSINESS_TYPES,
  TIME_OPTIONS,
  REGISTRATION_STATUS,
  NIGERIA_STATES,
} from '../constants';

interface FormFieldsProps {
  listingType: string;
  formData: ListingForm;
  handleChange: (e: any) => void;
  handleAmenitiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormFields = ({ listingType, formData, handleChange, handleAmenitiesChange }: FormFieldsProps) => {
  if (listingType === "property") {
    return (
      <div className="space-y-8">
        {/* Property form fields */}
        {/* ... Copy the property form fields from the original file ... */}
      </div>
    );
  }

  if (listingType === "business") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="legalname" className="text-sm font-medium">
            Legal Name
          </Label>
          <Input
            type="text"
            id="legalname"
            name="legalname"
            value={formData.legalname || ''}
            onChange={handleChange}
            className="mt-1 bg-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="industry" className="text-sm font-medium">
            Industry
          </Label>
          <select
            id="industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            required
          >
            <option value="">Select Industry</option>
            {BUSINESS_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="businessType" className="text-sm font-medium">
            Business Type
          </Label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            required
          >
            <option value="">Select Business Type</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="businessAddress" className="text-sm font-medium">
            Business Address
          </Label>
          <Textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress || ''}
            onChange={handleChange}
            className="mt-1 bg-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="openingTime" className="text-sm font-medium">
              Opening Time
            </Label>
            <select
              id="openingTime"
              name="openingTime"
              value={formData.openingTime || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="">Select Opening Time</option>
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="closingTime" className="text-sm font-medium">
              Closing Time
            </Label>
            <select
              id="closingTime"
              name="closingTime"
              value={formData.closingTime || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="">Select Closing Time</option>
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="registrationStatus" className="text-sm font-medium">
            Registration Status
          </Label>
          <select
            id="registrationStatus"
            name="registrationStatus"
            value={formData.registrationStatus || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            required
          >
            <option value="">Select Registration Status</option>
            {REGISTRATION_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {formData.registrationStatus === 'Registered' && (
          <>
            <div>
              <Label htmlFor="businessNumber" className="text-sm font-medium">
                Business Number
              </Label>
              <Input
                type="text"
                id="businessNumber"
                name="businessNumber"
                value={formData.businessNumber || ''}
                onChange={handleChange}
                className="mt-1 bg-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="taxId" className="text-sm font-medium">
                Tax ID
              </Label>
              <Input
                type="text"
                id="taxId"
                name="taxId"
                value={formData.taxId || ''}
                onChange={handleChange}
                className="mt-1 bg-white"
                required
              />
            </div>
          </>
        )}
      </div>
    );
  }

  if (listingType === "product") {
    return (
      <>
        {/* Product form fields */}
        {/* ... Copy the product form fields from the original file ... */}
      </>
    );
  }

  if (listingType === "service") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="serviceName" className="text-sm font-medium">
            Service Name
          </Label>
          <Input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName || ''}
            onChange={handleChange}
            className="mt-1 bg-white text-sm"
            required
          />
        </div>

        <div>
          <Label htmlFor="serviceCategory" className="text-sm font-medium">
            Service Category
          </Label>
          <select
            id="serviceCategory"
            name="serviceCategory"
            value={formData.serviceCategory || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
            required
          >
            <option value="">Select Category</option>
            <option value="Tech & Digital">Tech & Digital</option>
            <option value="Home Services">Home Services</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Education">Education</option>
            <option value="Legal Services">Legal Services</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Creative Services">Creative Services</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="mt-1 bg-white text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price" className="text-sm font-medium">
              Price
            </Label>
            <Input
              type="text"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              placeholder="Enter price or 'Call for Price'"
              required
            />
          </div>

          <div>
            <Label htmlFor="responseTime" className="text-sm font-medium">
              Response Time
            </Label>
            <Input
              type="text"
              id="responseTime"
              name="responseTime"
              value={formData.responseTime || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              placeholder="e.g., Within 24 hours"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="emergencyServices" className="text-sm font-medium">
              Emergency Services
            </Label>
            <select
              id="emergencyServices"
              name="emergencyServices"
              value={formData.emergencyServices ? "true" : "false"}
              onChange={e => handleChange({ target: { name: 'emergencyServices', value: e.target.value === "true" } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <Label htmlFor="isAvailable" className="text-sm font-medium">
              Availability
            </Label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={formData.isAvailable ? "true" : "false"}
              onChange={e => handleChange({ target: { name: 'isAvailable', value: e.target.value === "true" } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="isVerified" className="text-sm font-medium">
              Verification Status
            </Label>
            <select
              id="isVerified"
              name="isVerified"
              value={formData.isVerified ? "true" : "false"}
              onChange={e => handleChange({ target: { name: 'isVerified', value: e.target.value === "true" } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="false">Not Verified</option>
              <option value="true">Verified</option>
            </select>
          </div>

          <div>
            <Label htmlFor="featured" className="text-sm font-medium">
              Featured
            </Label>
            <select
              id="featured"
              name="featured"
              value={formData.featured ? "true" : "false"}
              onChange={e => handleChange({ target: { name: 'featured', value: e.target.value === "true" } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="state" className="text-sm font-medium">
              State
            </Label>
            <select
              id="state"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
              required
            >
              <option value="">Select State</option>
              {NIGERIA_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="mt-1 bg-white text-sm"
            required
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="website" className="text-sm font-medium">
              Website
            </Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="facebook" className="text-sm font-medium">
              Facebook
            </Label>
            <Input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              placeholder="https://facebook.com/your-page"
            />
          </div>

          <div>
            <Label htmlFor="instagram" className="text-sm font-medium">
              Instagram
            </Label>
            <Input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              className="mt-1 bg-white text-sm"
              placeholder="https://instagram.com/your-handle"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}; 