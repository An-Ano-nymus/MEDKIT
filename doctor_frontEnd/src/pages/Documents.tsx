import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Upload, Download, Eye, Calendar, Shield } from 'lucide-react';

// Mock data - user will replace with real data
const documents = [
  {
    id: 1,
    name: 'Medical Degree',
    type: 'degree',
    fileName: 'medical_degree_certificate.pdf',
    uploadDate: '2023-01-15',
    expiryDate: null,
    status: 'verified',
    size: '2.4 MB',
    thumbnail: 'https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    name: 'Medical License',
    type: 'license',
    fileName: 'medical_license_2024.pdf',
    uploadDate: '2024-01-01',
    expiryDate: '2025-12-31',
    status: 'active',
    size: '1.8 MB',
    thumbnail: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    name: 'Cardiology Specialization',
    type: 'certification',
    fileName: 'cardiology_board_cert.pdf',
    uploadDate: '2023-06-20',
    expiryDate: '2028-06-20',
    status: 'verified',
    size: '3.1 MB',
    thumbnail: 'https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    name: 'DEA Registration',
    type: 'registration',
    fileName: 'dea_registration_2024.pdf',
    uploadDate: '2024-01-10',
    expiryDate: '2024-12-31',
    status: 'expires_soon',
    size: '0.9 MB',
    thumbnail: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const documentTypes = [
  { key: 'all', label: 'All Documents', icon: FileText },
  { key: 'degree', label: 'Degrees', icon: FileText },
  { key: 'license', label: 'Licenses', icon: Shield },
  { key: 'certification', label: 'Certifications', icon: FileText },
  { key: 'registration', label: 'Registrations', icon: FileText }
];

export function Documents() {
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter(doc => 
    selectedType === 'all' || doc.type === selectedType
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge variant="success">Verified</Badge>;
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'expires_soon': return <Badge variant="warning">Expires Soon</Badge>;
      case 'expired': return <Badge variant="error">Expired</Badge>;
      default: return <Badge variant="default">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage your professional documents and certifications</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Document Type Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {documentTypes.map((type) => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.key)}
                className="flex items-center gap-2"
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Document Preview */}
              <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={document.thumbnail}
                  alt={document.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Document Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{document.name}</h3>
                  <p className="text-sm text-gray-500">{document.fileName}</p>
                </div>

                <div className="flex items-center justify-between">
                  {getStatusBadge(document.status)}
                  <span className="text-xs text-gray-500">{document.size}</span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Upload className="w-3 h-3" />
                    <span>Uploaded: {document.uploadDate}</span>
                  </div>
                  {document.expiryDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Expires: {document.expiryDate}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Accepted Formats</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF files (recommended)</li>
                <li>• JPEG/PNG images</li>
                <li>• Maximum file size: 10MB</li>
                <li>• High resolution preferred</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Medical degree certificate</li>
                <li>• Current medical license</li>
                <li>• Board certifications</li>
                <li>• DEA registration (if applicable)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Document Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">1</p>
              <p className="text-sm text-gray-600">Expires Soon</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">4</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}