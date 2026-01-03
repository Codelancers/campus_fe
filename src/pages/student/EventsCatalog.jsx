import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, X, Clock, FileText, Tag, Image as ImageIcon, Users, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents } from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EventsCatalog = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedBranch, selectedTab, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      const data = response.data || [];
      // Sort by latest first
      const sortedEvents = Array.isArray(data) ? data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) : [];
      setEvents(sortedEvents);
      // Let existing filter logic handle setting filteredEvents
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Search Filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(lowerQuery) ||
          event.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Branch Filter (Note: Assuming 'department' matches 'branch' logic/values)
    if (selectedBranch !== 'all') {
      filtered = filtered.filter((event) => event.department === selectedBranch);
    }

    // Tab Filter (Status/Registered)
    const now = new Date();
    if (selectedTab !== 'all') {
      if (selectedTab === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.startTime) > now);
      } else if (selectedTab === 'past') {
        filtered = filtered.filter(event => new Date(event.startTime) <= now);
      } else if (selectedTab === 'registered') {
        // Basic mock for registered status until backend supports it per-user
        // Currently assuming 'registered' flag might not exist on public list, 
        // so this might be empty unless we track it locally or in a separate API call.
        // For now, checks if event has a 'registered' property 
        filtered = filtered.filter(event => event.registered === true);
      }
    }

    setFilteredEvents(filtered);
  };

  const getPosterSrc = (poster) => {
    if (!poster) return null;
    if (typeof poster === 'string') return poster;
    if (poster.data && poster.type) {
      return `data:${poster.type === 0 ? 'image/png' : 'image/jpeg'};base64,${poster.data}`;
    }
    if (poster.data) {
      return `data:image/jpeg;base64,${poster.data}`;
    }
    return null;
  };

  const handleRegister = (e, eventId) => {
    e.stopPropagation();
    toast.success("Registration feature coming soon!");
  };

  const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    const posterSrc = getPosterSrc(event.poster);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200 dark:border-slate-800"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative h-64 md:h-80 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {posterSrc ? (
                <img
                  src={posterSrc}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                  <span className="text-lg font-medium">No Poster Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.eventType !== null && (
                    <Badge className={`${event.eventType === '0' || event.eventType === 0 ? 'bg-indigo-500' : 'bg-purple-500'} hover:bg-opacity-90 border-0`}>
                      {event.eventType === '0' || event.eventType === 0 ? 'Technical' : 'Cultural'}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md">
                    {event.department || 'General'}
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 shadow-sm">{event.title}</h2>
                <div className="flex items-center text-slate-200 text-sm md:text-base gap-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(event.startTime).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.venue}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                  <FileText className="w-5 h-5" />
                  <h3>Description</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  {event.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    <Clock className="w-5 h-5" />
                    <h3>Schedule & Registration</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Start Time</span>
                      <span className="text-slate-900 dark:text-slate-200">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">End Time</span>
                      <span className="text-slate-900 dark:text-slate-200">{new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 pt-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Deadline</span>
                      <span className="text-red-500 font-medium">{event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    <Users className="w-5 h-5" />
                    <h3>Participation</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{event.count || 0}</span>
                      <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-wide mt-1">Joined</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-slate-700 dark:text-slate-300">{event.maxParticipants}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide mt-1">Total Spots</span>
                    </div>
                  </div>
                </div>
              </div>

              {(event.requirements || event.skillTags) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {event.requirements && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Requirements
                      </h4>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-xl text-slate-700 dark:text-slate-300 text-sm">
                        {event.requirements}
                      </div>
                    </div>
                  )}

                  {event.skillTags && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Skill Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.skillTags.split(',').map((tag, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                            <Tag className="w-3 h-3 mr-1" /> {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
            <Button
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
              onClick={(e) => {
                handleRegister(e, event.id || event.eventId);
                onClose();
              }}
            >
              Register Now
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-8" data-testid="events-catalog">
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
          Campus Events
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Discover and register for exciting campus activities
        </p>
      </div>

      <Card className="card border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500"
                data-testid="search-events-input"
              />
            </div>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full md:w-64 h-11 bg-gray-50" data-testid="branch-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="MECH">MECH</SelectItem>
                <SelectItem value="CIVIL">CIVIL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <Card className="card border-dashed">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No events found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                const posterSrc = getPosterSrc(event.poster);
                const isUpcoming = new Date(event.startTime) > new Date();

                return (
                  <motion.div
                    key={event.id || event.eventId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer group h-full"
                  >
                    <Card className="card h-full overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-xl relative flex flex-col">
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {posterSrc ? (
                          <img
                            src={posterSrc}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <ImageIcon className="w-10 h-10 opacity-30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute top-4 right-4">
                          {event.registered ? (
                            <Badge className="bg-[#009688] text-white border-0 shadow-lg">
                              Registered
                            </Badge>
                          ) : !isUpcoming ? (
                            <Badge variant="outline" className="bg-white/90 text-gray-700 border-0">
                              Past Event
                            </Badge>
                          ) : null}
                        </div>

                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge variant="outline" className="bg-white/20 text-white border-white/20 backdrop-blur-md">
                            {event.department || 'General'}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-heading font-bold text-[#333333] mb-2 line-clamp-1 group-hover:text-[#3F51B5] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600 mt-auto">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#3F51B5]" />
                            <span>{new Date(event.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#3F51B5]" />
                            <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#3F51B5]" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#3F51B5]" />
                            <span>
                              {event.count || 0} / {event.maxParticipants} joined
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                          <Button
                            className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsCatalog;