import React from 'react';
import { Pill, Check, X } from 'lucide-react';

interface MedicationItemProps {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  taken: boolean;
  onToggle: () => void;
}

const MedicationItem: React.FC<MedicationItemProps> = ({ 
  name, dosage, frequency, timeOfDay, taken, onToggle 
}) => {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="mr-3 mt-1">
        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
          <Pill className="h-5 w-5 text-teal-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{name}</h4>
        <p className="text-xs text-gray-500">{dosage} • {frequency}</p>
        <div className="mt-1 flex items-center">
          {timeOfDay.map((time, index) => (
            <React.Fragment key={time}>
              {index > 0 && <span className="mx-1 text-gray-400">•</span>}
              <span className="text-xs text-gray-700">{time}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`ml-2 p-1 rounded-full ${
          taken 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {taken ? <Check size={16} /> : <X size={16} />}
      </button>
    </div>
  );
};

const MedicationsCard: React.FC = () => {
  const [medications, setMedications] = React.useState([
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Daily',
      timeOfDay: ['Morning'],
      taken: false
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily',
      timeOfDay: ['Morning', 'Evening'],
      taken: true
    },
    {
      id: '3',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeOfDay: ['Morning', 'Evening'],
      taken: false
    }
  ]);

  const toggleMedicationStatus = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Add medication
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationItem 
              key={medication.id} 
              {...medication} 
              onToggle={() => toggleMedicationStatus(medication.id)} 
            />
          ))
        ) : (
          <p className="py-4 text-sm text-gray-500">
            No medications added yet. Add your first medication.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicationsCard;