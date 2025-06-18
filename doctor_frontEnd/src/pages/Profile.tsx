import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Phone, MapPin, Calendar, Stethoscope, Edit3, Save, X } from 'lucide-react';

// Mock data - user will replace with real data
const doctorProfile = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@mediportal.com',
  phone: '+1 (555) 123-4567',
  address: '123 Medical Center Drive, Healthcare City, HC 12345',
  specialty: 'Cardiologist',
  experience: '15 years',
  education: 'MD from Harvard Medical School',
  boardCertifications: ['Internal Medicine', 'Cardiovascular Disease'],
  languages: ['English', 'Spanish', 'French'],
  bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and has published numerous research papers in leading medical journals.',
  avatar: ''
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(doctorProfile);

  const handleSave = () => {
    // Placeholder for save logic - user will implement
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(doctorProfile);
    setIsEditing(false);
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your professional profile information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar 
                src={profile.avatar} 
                fallback={profile.name.split(' ').map(n => n[0]).join('')}
                size="xl"
                className="mx-auto mb-4"
              />
              
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className="text-center font-semibold"
                  />
                  <Input
                    value={profile.specialty}
                    onChange={(e) => updateProfile('specialty', e.target.value)}
                    className="text-center"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                  <p className="text-gray-600 mb-3">{profile.specialty}</p>
                </>
              )}
              
              <Badge variant="info" className="mb-4">
                {profile.experience} Experience
              </Badge>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Board Certified</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Available Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <Input
                    value={profile.address}
                    onChange={(e) => updateProfile('address', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profile.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                {isEditing ? (
                  <Input
                    value={profile.education}
                    onChange={(e) => updateProfile('education', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profile.education}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Board Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {profile.boardCertifications.map((cert, index) => (
                    <Badge key={index} variant="default">{cert}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <Badge key={index} variant="info">{language}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1,247</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">4.9</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">15</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}