import { ListingForm } from '../../add-listing/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Clock, Globe, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

interface ServiceViewProps {
  service: ListingForm;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ServiceView = ({ service, onEdit, onDelete }: ServiceViewProps) => {
  const handleEdit = () => {
    if (service._id) {
      onEdit(service._id);
    }
  };

  const handleDelete = () => {
    if (service._id) {
      onDelete(service._id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{service.serviceName}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="text-sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Main Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={service.isVerified ? "default" : "secondary"}>
                {service.isVerified ? "Verified" : "Not Verified"}
              </Badge>
              <Badge variant={service.featured ? "default" : "outline"}>
                {service.featured ? "Featured" : "Standard"}
              </Badge>
              <Badge variant={service.isAvailable ? "default" : "destructive"}>
                {service.isAvailable ? "Available" : "Not Available"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="text-sm">{service.serviceCategory}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-sm text-gray-700">{service.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="text-sm">{service.price}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Response Time</h3>
                <p className="text-sm">{service.responseTime}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Emergency Services</h3>
              <p className="text-sm">{service.emergencyServices ? "Available" : "Not Available"}</p>
            </div>
          </div>

          {/* Right Column - Location & Social */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{service.address}, {service.city}, {service.state}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Social Links</h3>
              <div className="space-y-2">
                {service.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {service.website}
                    </a>
                  </div>
                )}
                {service.facebook && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Facebook className="h-4 w-4 text-gray-500" />
                    <a href={service.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {service.facebook}
                    </a>
                  </div>
                )}
                {service.instagram && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Instagram className="h-4 w-4 text-gray-500" />
                    <a href={service.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {service.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
              <div className="space-y-1 text-sm">
                <p>Name: {service.contactName}</p>
                <p>Email: {service.contactEmail}</p>
                <p>Phone: {service.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Images */}
        {service.featuredImage && service.featuredImage.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Featured Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {service.featuredImage.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Service image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 