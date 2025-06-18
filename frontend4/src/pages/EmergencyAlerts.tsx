import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, User, Heart } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

interface Hospital {
  id: string;
  name: string;
  distance: string;
  address: string;
  phone: string;
}

const EmergencyAlerts: React.FC = () => {
  const [isEmergency, setIsEmergency] = useState(false);

  const emergencyContacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      relation: 'Spouse',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      name: 'Jane Smith',
      relation: 'Parent',
      phone: '+1 (555) 987-6543'
    }
  ];

  const nearbyHospitals: Hospital[] = [
    {
      id: '1',
      name: 'City General Hospital',
      distance: '2.5 miles',
      address: '123 Medical Center Dr',
      phone: '+1 (555) 111-2222'
    },
    {
      id: '2',
      name: 'St. Mary\'s Medical Center',
      distance: '3.8 miles',
      address: '456 Healthcare Ave',
      phone: '+1 (555) 333-4444'
    }
  ];

  const triggerEmergency = () => {
    setIsEmergency(true);
    // Simulate emergency alert
    setTimeout(() => {
      setIsEmergency(false);
    }, 5000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Services</h1>
        <button
          onClick={triggerEmergency}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Trigger Emergency Alert</span>
          </div>
        </button>
      </div>

      {isEmergency && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">
                Emergency alert has been triggered. Contacting emergency services and notifying emergency contacts...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Emergency Contacts</h2>
          <div className="space-y-4">
            {emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.relation}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    {contact.phone}
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Add Emergency Contact
            </button>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nearby Hospitals</h2>
          <div className="space-y-4">
            {nearbyHospitals.map(hospital => (
              <div key={hospital.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                    <span className="text-sm text-gray-500">{hospital.distance}</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hospital.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {hospital.phone}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Medical Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Blood Type</span>
              <span className="font-medium">A+</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Allergies</span>
              <span className="font-medium">Penicillin</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Current Medications</span>
              <span className="font-medium">View List</span>
            </div>
          </div>
        </div>

        {/* Emergency Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Emergency Instructions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800">In Case of Emergency</h3>
              <ul className="mt-2 space-y-2 text-sm text-yellow-700">
                <li>1. Stay calm and assess the situation</li>
                <li>2. Press the emergency button above</li>
                <li>3. Follow instructions from emergency services</li>
                <li>4. Keep your medical info card accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlerts;