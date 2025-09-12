import { useState } from 'react';
import { ListingForm } from '../types';

export const useImageUpload = (formData: ListingForm, setFormData: (data: ListingForm) => void) => {
  const [iuploading, setIUploading] = useState(false);
  const [businessProfilePictureUploading, setBusinessProfilePictureUploading] = useState(false);
  const [businessLogoUploading, setBusinessLogoUploading] = useState(false);
  const [legalDocumentUploading, setLegalDocumentUploading] = useState(false);
  const [productImageUploading, setProductImageUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIUploading(true);
    const files = e.target.files;
    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('file', files[i]);
    }
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...data.urls],
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    }
    setIUploading(false);
  };

  const handleBusinessProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBusinessProfilePictureUploading(true);
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        businessProfilePicture: data.url,
      });
    } catch (error) {
      console.error('Error uploading business profile picture:', error);
    }
    setBusinessProfilePictureUploading(false);
  };

  const handleBusinessLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBusinessLogoUploading(true);
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        businessLogo: data.url,
      });
    } catch (error) {
      console.error('Error uploading business logo:', error);
    }
    setBusinessLogoUploading(false);
  };

  const handleBusinessCacUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLegalDocumentUploading(true);
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        legalDocument: data.url,
      });
    } catch (error) {
      console.error('Error uploading legal document:', error);
    }
    setLegalDocumentUploading(false);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setProductImageUploading(true);
    const files = e.target.files;
    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('file', files[i]);
    }
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        productImages: [...(formData.productImages || []), ...data.urls],
      });
    } catch (error) {
      console.error('Error uploading product images:', error);
    }
    setProductImageUploading(false);
  };

  return {
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
  };
}; 