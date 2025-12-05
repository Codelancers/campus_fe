import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EventsCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Tech Hackathon 2025',
      description: 'Build innovative solutions in 24 hours',
      date: '2025-02-15',
      time: '09:00 AM',
      venue: 'Auditorium Hall',
      branch: 'All Branches',
      participants: 45,
      maxParticipants: 100,
      status: 'upcoming',
      registered: true,
      image: 'https://images.unsplash.com/photo-1646579885920-0c9a01cb7078',
    },
    {
      id: 2,
      title: 'Workshop: AI & Machine Learning',
      description: 'Learn fundamentals of AI and ML',
      date: '2025-02-20',
      time: '02:00 PM',
      venue: 'Lab 301',
      branch: 'Computer Science',
      participants: 30,
      maxParticipants: 50,
      status: 'upcoming',
      registered: false,
      image: 'https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d',
    },
    {
      id: 3,
      title: 'Annual Cultural Fest',
      description: 'Showcase your talent in music, dance, and drama',
      date: '2025-03-05',
      time: '10:00 AM',
      venue: 'Main Ground',
      branch: 'All Branches',
      participants: 120,
      maxParticipants: 200,
      status: 'upcoming',
      registered: false,
      image: 'https://images.unsplash.com/photo-1718634353354-fa2fc07e3080',
    },
    {
      id: 4,
      title: 'Code Sprint 2024',
      description: 'Competitive programming challenge',
      date: '2025-01-28',
      time: '03:00 PM',
      venue: 'Computer Lab',
      branch: 'All Branches',
      participants: 85,
      maxParticipants: 100,
      status: 'past',
      registered: true,
      image: 'https://images.unsplash.com/photo-1646579886135-068c73800308',
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || event.branch === selectedBranch;
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'upcoming' && event.status === 'upcoming') ||
      (selectedTab === 'registered' && event.registered) ||
      (selectedTab === 'past' && event.status === 'past');

    return matchesSearch && matchesBranch && matchesTab;
  });

  return (
    <div className="space-y-8" data-testid="events-catalog">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
          Campus Events
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Discover and register for exciting campus activities
        </p>
      </div>

      {/* Filters */}
      <Card className="card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 bg-gray-50 border-gray-200"
                data-testid="search-events-input"
              />
            </div>

            {/* Branch Filter */}
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full md:w-64 h-11 bg-gray-50" data-testid="branch-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="all" data-testid="tab-all-events">All Events</TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming-events">Upcoming</TabsTrigger>
          <TabsTrigger value="registered" data-testid="tab-registered-events">Registered</TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past-events">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <Card className="card">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">No events found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="masonry-grid">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="masonry-grid-item"
                >
                  <Card className="card overflow-hidden" data-testid={`event-card-${event.id}`}>
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        {event.registered ? (
                          <Badge className="bg-[#009688] text-white border-0 shadow-lg">
                            Registered
                          </Badge>
                        ) : event.status === 'past' ? (
                          <Badge variant="outline" className="bg-white/90 text-gray-700 border-0">
                            Past Event
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#3F51B5]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#3F51B5]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#3F51B5]" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#3F51B5]" />
                          <span>
                            {event.participants} / {event.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      {/* Branch Badge */}
                      <Badge variant="outline" className="border-[#009688] text-[#009688]">
                        {event.branch}
                      </Badge>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link to={`/student/events/${event.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full border-[#3F51B5] text-[#3F51B5] hover:bg-indigo-50"
                            data-testid={`view-event-${event.id}-button`}
                          >
                            View Details
                          </Button>
                        </Link>
                        {!event.registered && event.status === 'upcoming' && (
                          <Button
                            className="flex-1 btn-accent"
                            data-testid={`register-event-${event.id}-button`}
                          >
                            Register
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsCatalog;