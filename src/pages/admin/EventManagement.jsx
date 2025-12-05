import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    {
      id: 1,
      title: 'Tech Hackathon 2025',
      date: '2025-02-15',
      branch: 'All Branches',
      registrations: 45,
      maxParticipants: 100,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'AI Workshop',
      date: '2025-02-20',
      branch: 'Computer Science',
      registrations: 30,
      maxParticipants: 50,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Code Sprint 2024',
      date: '2025-01-28',
      branch: 'All Branches',
      registrations: 85,
      maxParticipants: 100,
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-8" data-testid="event-management">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333]">
            Event Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">Create and manage campus events</p>
        </div>
        <Link to="/admin/events/create">
          <Button className="btn-accent" data-testid="create-new-event-button">
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <Card className="card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-gray-50"
              data-testid="search-events-admin-input"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card hover:shadow-lg transition-shadow" data-testid={`admin-event-${event.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-heading font-bold text-[#333333]">
                        {event.title}
                      </h3>
                      <Badge className={event.status === 'upcoming' ? 'bg-[#CDDC39] text-gray-900' : 'bg-[#009688] text-white'}>                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="border-[#009688] text-[#009688]">
                        {event.branch}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3F51B5]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#3F51B5]" />
                        <span>{event.registrations} / {event.maxParticipants} participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/events/edit/${event.id}`}>
                      <Button variant="outline" size="sm" data-testid={`edit-event-${event.id}-button`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" data-testid={`delete-event-${event.id}-button`}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventManagement;