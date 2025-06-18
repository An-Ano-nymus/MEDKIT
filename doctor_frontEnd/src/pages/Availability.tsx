import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Clock, Plus, Trash2, Save } from 'lucide-react';

// Mock data - user will replace with real data
const initialSchedule = {
  monday: [
    { id: 1, start: '09:00', end: '12:00', available: true },
    { id: 2, start: '14:00', end: '17:00', available: true }
  ],
  tuesday: [
    { id: 3, start: '09:00', end: '12:00', available: true },
    { id: 4, start: '14:00', end: '16:00', available: true }
  ],
  wednesday: [
    { id: 5, start: '10:00', end: '13:00', available: true },
    { id: 6, start: '15:00', end: '18:00', available: true }
  ],
  thursday: [
    { id: 7, start: '09:00', end: '12:00', available: true },
    { id: 8, start: '14:00', end: '17:00', available: true }
  ],
  friday: [
    { id: 9, start: '09:00', end: '12:00', available: true },
    { id: 10, start: '13:00', end: '15:00', available: true }
  ],
  saturday: [],
  sunday: []
};

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export function Availability() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isEditing, setIsEditing] = useState(false);

  const addTimeSlot = (day: string) => {
    const newSlot = {
      id: Date.now(),
      start: '09:00',
      end: '10:00',
      available: true
    };
    
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day as keyof typeof prev], newSlot]
    }));
  };

  const removeTimeSlot = (day: string, slotId: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].filter(slot => slot.id !== slotId)
    }));
  };

  const updateTimeSlot = (day: string, slotId: number, field: string, value: string | boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].map(slot =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const saveSchedule = () => {
    // Placeholder for save logic - user will implement
    console.log('Saving schedule:', schedule);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Settings</h1>
          <p className="text-gray-600">Manage your available time slots</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveSchedule} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Schedule
            </Button>
          )}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {daysOfWeek.map((day) => (
          <Card key={day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {day}
                </CardTitle>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Slot
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedule[day as keyof typeof schedule].length === 0 ? (
                  <p className="text-gray-500 text-sm">No availability set</p>
                ) : (
                  schedule[day as keyof typeof schedule].map((slot) => (
                    <div key={slot.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                      {isEditing ? (
                        <>
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)}
                            className="w-auto"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)}
                            className="w-auto"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={slot.available}
                              onChange={(e) => updateTimeSlot(day, slot.id, 'available', e.target.checked)}
                              className="rounded"
                            />
                            Available
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(day, slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">
                            {slot.start} - {slot.end}
                          </span>
                          <Badge variant={slot.available ? 'success' : 'error'}>
                            {slot.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Set Default Hours</span>
              <span className="text-xs text-gray-500">9 AM - 5 PM</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Block Time Off</span>
              <span className="text-xs text-gray-500">Vacation/Personal</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Copy Schedule</span>
              <span className="text-xs text-gray-500">Duplicate week</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">32</p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">24</p>
              <p className="text-sm text-gray-600">Available Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-600">Booked Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">75%</p>
              <p className="text-sm text-gray-600">Availability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}