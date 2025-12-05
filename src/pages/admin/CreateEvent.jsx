import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    branch: 'all',
    maxParticipants: '',
    registrationDeadline: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Event created successfully!');
    navigate('/admin/events');
  };

  return (
    <div className="space-y-6" data-testid="create-event-page">
      <Button variant="ghost" onClick={() => navigate(-1)} data-testid="back-to-events-button">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <div>
        <h1 className="text-4xl font-heading font-bold text-[#333333]">Create New Event</h1>
        <p className="text-lg text-gray-600 mt-2">Fill in the details to create an event</p>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading font-bold">Event Information</CardTitle>
          <CardDescription>Provide basic details about the event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Tech Hackathon 2025"
                className="h-11 bg-gray-50"
                data-testid="event-title-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the event..."
                className="min-h-32 bg-gray-50"
                data-testid="event-description-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="h-11 bg-gray-50"
                  data-testid="event-date-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="h-11 bg-gray-50"
                  data-testid="event-time-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleChange('venue', e.target.value)}
                  placeholder="e.g., Auditorium Hall"
                  className="h-11 bg-gray-50"
                  data-testid="event-venue-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Target Branch *</Label>
                <Select value={formData.branch} onValueChange={(value) => handleChange('branch', value)}>
                  <SelectTrigger className="h-11 bg-gray-50" data-testid="event-branch-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', e.target.value)}
                  placeholder="e.g., 100"
                  className="h-11 bg-gray-50"
                  data-testid="max-participants-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                  className="h-11 bg-gray-50"
                  data-testid="registration-deadline-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poster">Event Poster (9:16) *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#3F51B5] transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG (9:16 aspect ratio recommended)</p>
                <Input id="poster" type="file" className="hidden" data-testid="event-poster-input" />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="btn-accent" data-testid="create-event-submit-button">
                Create Event
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} data-testid="cancel-create-event-button">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;