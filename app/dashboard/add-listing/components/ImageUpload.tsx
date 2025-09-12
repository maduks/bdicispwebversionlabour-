import { useState } from 'react';
import { ListingForm } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';

interface ImageUploadProps {
  listingType: string;
  formData: ListingForm;
  setFormData: (data: ListingForm) => void;
}

export const ImageUpload = ({ listingType, formData, setFormData }: ImageUploadProps) => {
  const {
    iuploading,
    businessProfilePictureUploading,
    businessLogoUploading,
    legalDocumentUploading,
    productImageUploading,
    handleImageUpload,
    handleBusinessProfileUpload,
    handleBusinessLogoUpload,
    handleBusinessCacUpload,
    handleProductImageUpload
  } = useImageUpload(formData, setFormData);

  if (listingType === "business") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="businessProfilePicture" className="text-sm font-medium">
            Business Profile Picture
          </Label>
          <div className="mt-1">
            <input
              type="file"
              id="businessProfilePicture"
              accept="image/*"
              onChange={handleBusinessProfileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50"
            />
            {businessProfilePictureUploading && (
              <p className="mt-1 text-sm text-gray-500">Uploading...</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="businessLogo" className="text-sm font-medium">
            Business Logo
          </Label>
          <div className="mt-1">
            <input
              type="file"
              id="businessLogo"
              accept="image/*"
              onChange={handleBusinessLogoUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50"
            />
            {businessLogoUploading && (
              <p className="mt-1 text-sm text-gray-500">Uploading...</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="legalDocument" className="text-sm font-medium">
            Legal CAC Documents
          </Label>
          <div className="mt-1">
            <input
              type="file"
              id="legalDocument"
              accept="image/*,.pdf"
              onChange={handleBusinessCacUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50"
            />
            {legalDocumentUploading && (
              <p className="mt-1 text-sm text-gray-500">Uploading...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (listingType === "product") {
    return (
      <div>
        <Label htmlFor="productImages" className="text-sm font-medium">
          Product Images
        </Label>
        <div className="mt-1">
          <input
            type="file"
            id="productImages"
            accept="image/*"
            multiple
            onChange={handleProductImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-white file:text-gray-700
              hover:file:bg-gray-50"
          />
          {productImageUploading && (
            <p className="mt-1 text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="images" className="text-sm font-medium">
        Images
      </Label>
      <div className="mt-1">
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-white file:text-gray-700
            hover:file:bg-gray-50"
        />
        {iuploading && (
          <p className="mt-1 text-sm text-gray-500">Uploading...</p>
        )}
      </div>
    </div>
  );
}; 