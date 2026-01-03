import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Users, Calendar, MapPin, X, Clock, FileText, Tag, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents, deleteEvent } from '@/lib/api';
import { toast } from 'sonner';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(lowerQuery) ||
          event.department?.toLowerCase().includes(lowerQuery) ||
          event.description?.toLowerCase().includes(lowerQuery)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      const data = response.data || [];
      // Sort by latest first
      const sortedEvents = Array.isArray(data) ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, eventId) => {
    e.stopPropagation(); // Prevent opening modal
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  // Helper to convert poster data to image source
  const getPosterSrc = (poster) => {
    if (!poster) return null;
    if (typeof poster === 'string') return poster; // Already a URL
    if (poster.data && poster.type) {
      // Assuming data is base64 string without prefix
      return `data:${poster.type === 0 ? 'image/png' : 'image/jpeg'};base64,${poster.data}`;
    }
    // If it's the raw byte object structure user showed
    if (poster.data) {
      return `data:image/jpeg;base64,${poster.data}`;
    }
    return null;
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
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Header Image */}
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
              {/* Description */}
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
                {/* Time & Registration */}
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
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Registration Deadline</span>
                      <span className="text-red-500 font-medium">{event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Counts */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    <Users className="w-5 h-5" />
                    <h3>Participation</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{event.count || 0}</span>
                      <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-wide mt-1">Registered</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-slate-700 dark:text-slate-300">{event.maxParticipants}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide mt-1">Capacity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements & Tags */}
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
            <Link to={`/admin/events/edit/${event.id || event.eventId}`} className='w-full md:w-auto'>
              <Button variant="outline" className="w-full md:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                <Edit className="w-4 h-4 mr-2" /> Edit Event
              </Button>
            </Link>
            <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onClose}>Close Details</Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10" data-testid="event-management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] dark:text-white">
            Event Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Create and manage campus events</p>
        </div>
        <Link to="/admin/events/create">
          <Button className="btn-accent h-12 px-6 text-base shadow-lg hover:shadow-indigo-500/30 transition-all w-full md:w-auto" data-testid="create-new-event-button">
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by title, department, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              data-testid="search-events-admin-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No Events Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or create a new event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const posterSrc = getPosterSrc(event.poster);
            return (
              <motion.div
                key={event.id || event.eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer group"
              >
                <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-900 rounded-xl relative">
                  {/* Image Section */}
                  <div className="h-48 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      {event.eventType !== null && (
                        <Badge className={`${event.eventType === '0' || event.eventType === 0 ? 'bg-indigo-500' : 'bg-purple-500'} shadow-lg border-0 bg-opacity-90 backdrop-blur-sm`}>
                          {event.eventType === '0' || event.eventType === 0 ? 'Technical' : 'Cultural'}
                        </Badge>
                      )}
                    </div>

                    {/* Department Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/20 backdrop-blur-md">
                        {event.department}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>{new Date(event.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        <Users className="w-3.5 h-3.5" />
                        {event.count || 0}/{event.maxParticipants}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => handleDelete(e, event.id || event.eventId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;