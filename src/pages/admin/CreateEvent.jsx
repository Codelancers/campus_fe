import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, Calendar as CalendarIcon, Clock, Type as TypeIcon, FileText, Tag, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css'; // Removed as react-clock is not in package.json
import { createEvent } from '@/lib/api';
import './CreateEventCustom.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    venue: '',
    maxParticipantsSelection: '', // For the dropdown logic
    maxParticipantsCustom: '',
    skillTags: '',
    requirements: '',
    eventType: '0', // Default '0' for Technical
    poster: null,   // Stores the File object
  });

  const [posterPreview, setPosterPreview] = useState('');

  // Date and Time states
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState('12:00');
  const [registrationEndDate, setRegistrationEndDate] = useState(new Date());

  // UI States for Calendar popups
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showRegEndCalendar, setShowRegEndCalendar] = useState(false);

  const departments = [
    { value: 'cse', label: 'CSE' },
    { value: 'ece', label: 'ECE' },
    { value: 'eee', label: 'EEE' },
    { value: 'me', label: 'ME' },
    { value: 'ce', label: 'CE' },
    { value: 'cse_aligned', label: 'CSE (Aligned Branches)' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.error('Only PNG and JPG images are allowed.');
        return;
      }

      // Store file object for FormData
      setFormData((prev) => ({ ...prev, poster: file }));

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPosterPreview(objectUrl);

      // Note: In a real app, we should cleanup this URL using useEffect or when component unmounts
      // but for this simple interaction, relying on browser cleanup is acceptable or we can add useEffect.
    }
  };

  // Helper to format date as YYYY-MM-DD
  const formatDateForApi = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get Creator ID from localStorage
      const adminDataString = localStorage.getItem('adminData');
      let creatorId = "69301a6666cd6771b2183db6"; // Default/Fallback
      if (adminDataString) {
        try {
          const adminData = JSON.parse(adminDataString);
          if (adminData.id) creatorId = adminData.id;
        } catch (err) {
          console.error("Error parsing adminData", err);
        }
      }

      // 2. Construct Date Objects
      const combineDateAndTime = (dateObj, timeString) => {
        if (!dateObj || !timeString) return null;
        const [hours, minutes] = timeString.split(':').map(Number);
        const newDate = new Date(dateObj);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return newDate.toISOString();
      };

      const startDateTimeIso = combineDateAndTime(startDate, startTime);
      const endDateTimeIso = combineDateAndTime(endDate, endTime);

      if (!startDateTimeIso || !endDateTimeIso) {
        toast.error('Please select valid start and end dates and times.');
        setLoading(false);
        return;
      }

      // 3. Max Participants Logic
      let maxParticipantsVal = 0;
      if (formData.maxParticipantsSelection === 'custom') {
        maxParticipantsVal = parseInt(formData.maxParticipantsCustom);
      } else {
        maxParticipantsVal = parseInt(formData.maxParticipantsSelection);
      }

      if (!maxParticipantsVal || isNaN(maxParticipantsVal)) {
        toast.error('Please specify a valid number for max participants.');
        setLoading(false);
        return;
      }

      // 4. Construct FormData Payload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('department', formData.department);
      data.append('venue', formData.venue);
      data.append('startTime', startDateTimeIso);
      data.append('endTime', endDateTimeIso);
      data.append('maxParticipants', maxParticipantsVal);
      data.append('skillTags', formData.skillTags);
      data.append('requirements', formData.requirements);
      data.append('registrationEndDate', formatDateForApi(registrationEndDate));
      data.append('eventType', formData.eventType);

      if (formData.poster) {
        data.append('poster', formData.poster);
      }

      console.log("Creating Event FormData Payload");
      // Debug log
      for (let pair of data.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // 5. Call API
      // Since we are sending FormData, createEvent needs to handle it correctly.
      // Axios usually detects FormData and sets headers.
      await createEvent(creatorId, data);

      toast.success('Event created successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error("Create Event Error:", error);
      toast.error(error.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10" data-testid="create-event-page">
      <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create New Event</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Design an engaging event experience.</p>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Event Details</CardTitle>
          <CardDescription>Fill out the form below to publish your event.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Description */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Event Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Annual Tech Symposium 2025"
                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the event..."
                  className="min-h-[120px] bg-white dark:bg-slate-950 border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Requirements & Skill Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Laptop, ID Card, etc."
                    className="min-h-[80px] bg-white dark:bg-slate-950 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillTags" className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Skill Tags
                  </Label>
                  <Input
                    id="skillTags"
                    value={formData.skillTags}
                    onChange={(e) => handleInputChange('skillTags', e.target.value)}
                    placeholder="Java, Python, Public Speaking (Comma separated)"
                    className="h-12 bg-white dark:bg-slate-950 border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Department, Venue, Event Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">Department <span className="text-red-500">*</span></Label>
                <Select value={formData.department} onValueChange={(val) => handleInputChange('department', val)} required>
                  <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="text-sm font-medium">Venue <span className="text-red-500">*</span></Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="e.g., Main Auditorium"
                  className="h-12 bg-white dark:bg-slate-950 border-slate-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TypeIcon className="w-4 h-4" />
                  Event Type <span className="text-red-500">*</span>
                </Label>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 rounded-lg p-2 h-12 flex items-center">
                  <RadioGroup
                    value={formData.eventType}
                    onValueChange={(val) => handleInputChange('eventType', val)}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="technical" />
                      <Label htmlFor="technical" className="cursor-pointer">Technical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="cultural" />
                      <Label htmlFor="cultural" className="cursor-pointer">Cultural</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Schedule & Registration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Start Time */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Start Date & Time <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <div
                        className="flex items-center h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-slate-50"
                        onClick={() => setShowStartCalendar(!showStartCalendar)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {startDate ? startDate.toLocaleDateString() : <span>Pick a date</span>}
                      </div>
                      {showStartCalendar && (
                        <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-2">
                          <Calendar
                            onChange={(date) => { setStartDate(date); setShowStartCalendar(false); }}
                            value={startDate}
                            className="rounded-md border-none"
                          />
                        </div>
                      )}
                    </div>
                    <div className="custom-time-picker-wrapper">
                      <TimePicker
                        onChange={setStartTime}
                        value={startTime}
                        disableClock={false}
                        clearIcon={null}
                        className="w-full h-12 bg-white border border-slate-200 rounded-md px-3 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">End Date & Time <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <div
                        className="flex items-center h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-slate-50"
                        onClick={() => setShowEndCalendar(!showEndCalendar)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {endDate ? endDate.toLocaleDateString() : <span>Pick a date</span>}
                      </div>
                      {showEndCalendar && (
                        <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-2">
                          <Calendar
                            onChange={(date) => { setEndDate(date); setShowEndCalendar(false); }}
                            value={endDate}
                            className="rounded-md border-none"
                          />
                        </div>
                      )}
                    </div>
                    <div className="custom-time-picker-wrapper">
                      <TimePicker
                        onChange={setEndTime}
                        value={endTime}
                        disableClock={false}
                        clearIcon={null}
                        className="w-full h-12 bg-white border border-slate-200 rounded-md px-3 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Registration End Date */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Registration Deadline <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div
                      className="flex items-center h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-slate-50"
                      onClick={() => setShowRegEndCalendar(!showRegEndCalendar)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {registrationEndDate ? formatDateForApi(registrationEndDate) : <span>Pick deadline</span>}
                    </div>
                    {showRegEndCalendar && (
                      <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-2 right-0">
                        <Calendar
                          onChange={(date) => { setRegistrationEndDate(date); setShowRegEndCalendar(false); }}
                          value={registrationEndDate}
                          className="rounded-md border-none"
                        />
                      </div>
                    )}
                  </div>
                  <div className="h-12 flex items-center text-xs text-slate-500 italic">
                    Participants cannot register after this date.
                  </div>
                </div>
              </div>
            </div>

            {/* Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-sm font-medium">Max Participants <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.maxParticipantsSelection}
                  onValueChange={(val) => handleInputChange('maxParticipantsSelection', val)}
                  required
                >
                  <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200">
                    <SelectValue placeholder="Select Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {formData.maxParticipantsSelection === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Enter custom number"
                    value={formData.maxParticipantsCustom}
                    onChange={(e) => handleInputChange('maxParticipantsCustom', e.target.value)}
                    className="mt-2 h-12"
                    min="1"
                  />
                )}
              </div>
            </div>

            {/* Poster Upload (Only 1 image field now) */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Event Poster <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden h-64">
                <Input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />

                {posterPreview ? (
                  <div className="relative z-10 w-full h-full flex justify-center items-center">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="max-h-full max-w-full rounded-lg shadow-md object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium">
                      Change Poster
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-14 w-14 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium">Event Poster</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG (Required)</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="submit"
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-12 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg w-full md:w-auto"
                disabled={loading}
              >
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