import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUser } from '@/lib/token';
import { getAllEvents } from '@/lib/api';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const navigate = useNavigate();
  // Get user data dynamically (including points updated in Layout)
  const user = getUser();
  const points = user?.points || localStorage.getItem('points') || 0;
  const userName = user ? user.name.split(' ')[0] : 'Student';
  const userRollNo = user?.rollNo || localStorage.getItem('rollNo');

  const [loading, setLoading] = useState(true);

  // Derived State
  const [stats, setStats] = useState({
    totalPoints: 0,
    eventsRegistered: 0,
    eventsWon: 0,
    certificates: 0,
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [wonEventsList, setWonEventsList] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      const allEvents = response.data || [];

      // Process Events
      const now = new Date();

      // 1. Registered Events
      const registered = allEvents.filter(e => e.registered);

      // 2. Upcoming Events
      const userDepartment = user?.department || localStorage.getItem('department');
      const upcoming = allEvents
        .filter(e => new Date(e.startTime) > now)
        // Filter by Department: Show if event has no dept, is General/All, or matches user dept
        .filter(e => {
          if (!userDepartment) return true; // Show all if user dept unknown (or maybe restrictive? standard is permissive if unknown)
          if (!e.department || ['general', 'all'].includes(e.department.toLowerCase())) return true;
          return e.department.toLowerCase() === userDepartment.toLowerCase();
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      // 3. Won Events
      const won = allEvents.filter(e => {
        if (!userRollNo) return false;
        const isDirectWinner = e.winner === userRollNo || e.winnerRollNo === userRollNo;
        const isInWinnersArray = Array.isArray(e.winners) && e.winners.includes(userRollNo);
        const isStatusWon = e.userStatus === 'WON';

        return isDirectWinner || isInWinnersArray || isStatusWon;
      });

      // 4. Past Events (for Recent Activity)
      const pastRegistered = registered
        .filter(e => new Date(e.startTime) <= now)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      setUpcomingEvents(upcoming);
      setWonEventsList(won);

      // Combine Won events and Past Registered events for "Recent Activity"
      const activity = [
        ...won.map(e => ({ ...e, type: 'winner', pointsEarned: 3 })),
        ...pastRegistered.filter(e => !won.find(w => w.eventId === e.eventId)).map(e => ({ ...e, type: 'participant', pointsEarned: 1 }))
      ].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 5); // Top 5

      setRecentActivity(activity);

      setStats({
        totalPoints: points,
        eventsRegistered: registered.length,
        eventsWon: won.length,
        certificates: won.length + registered.filter(e => e.status === 'COMPLETED').length,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (event) => {
    // Navigate to events page and open specific event
    navigate('/student/events', {
      state: {
        openEventId: event.eventId || event.id
      }
    });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
      data-testid="student-dashboard"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
          Welcome Back, {userName}! 👋
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Track your events, achievements, and campus activities
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-[#CDDC39] to-[#C0CA33] border-0 shadow-lg hover:shadow-xl transition-shadow duration-200" data-testid="points-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Total Points</CardTitle>
            <Trophy className="w-5 h-5 text-gray-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-gray-900">
              {stats.totalPoints}
            </div>
            <p className="text-xs text-gray-800 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Lifetime Earnings
            </p>
          </CardContent>
        </Card>

        <Card className="card" data-testid="registered-events-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Events Registered</CardTitle>
            <Calendar className="w-5 h-5 text-[#3F51B5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.eventsRegistered}
            </div>
            <Progress value={Math.min(stats.eventsRegistered * 10, 100)} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="card" data-testid="won-events-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Events Won</CardTitle>
            <Award className="w-5 h-5 text-[#009688]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.eventsWon}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.eventsRegistered > 0 ? ((stats.eventsWon / stats.eventsRegistered) * 100).toFixed(0) : 0}% win rate
            </p>
          </CardContent>
        </Card>

        <Card className="card" data-testid="certificates-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates</CardTitle>
            <Award className="w-5 h-5 text-[#009688]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.certificates}
            </div>
            <Link to="/student/certificates" className="text-xs text-[#3F51B5] hover:underline mt-1 inline-block">
              View all certificates
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Won Events Section */}
      {wonEventsList.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-[#CDDC39]" />
            <h2 className="text-2xl font-heading font-bold text-[#333333]">Your Victories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wonEventsList.map((event) => (
              <Card key={event.eventId || event.id} className="card border-l-4 border-l-[#CDDC39]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">{event.title}</CardTitle>
                  <CardDescription>{new Date(event.startTime).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#CDDC39] text-gray-900 hover:bg-[#C0CA33]">Winner</Badge>
                    <span className="text-sm font-semibold text-[#009688]">+ Points Added</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}


      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events - Larger */}
        <div className="md:col-span-2 md:row-span-2">
          <Card className="card h-full" data-testid="upcoming-events-section">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Don't miss out on exciting opportunities</CardDescription>
                </div>
                <Link to="/student/events">
                  <Button variant="outline" size="sm" className="border-[#3F51B5] text-[#3F51B5]" data-testid="view-all-events-button">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No upcoming events found.</p>
                </div>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => { // Limit to 5
                  const posterSrc = getPosterSrc(event.poster);
                  return (
                    <div
                      key={event.eventId || event.id}
                      className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#3F51B5] hover:shadow-md transition-all duration-200 group"
                      data-testid={`upcoming-event-${event.id}`}
                    >
                      <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {posterSrc ? (
                          <img
                            src={posterSrc}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <ImageIcon className="w-8 h-8 opacity-50" />
                          </div>
                        )}
                        {event.registered && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-[#009688] text-white border-0">Registered</Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading font-semibold text-lg text-[#333333] mb-2 truncate">
                            {event.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">{event.department || 'General'}</Badge>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#3F51B5]" />
                            <span>{new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#3F51B5]" />
                            <span>{event.venue || 'TBA'}</span>
                          </div>
                        </div>
                        {!event.registered && (
                          <Button
                            className="mt-3 btn-accent h-9 text-sm"
                            onClick={() => handleRegisterClick(event)}
                            data-testid={`register-event-${event.id}-button`}
                          >
                            Register Now
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements / Activity */}
        <div className="md:col-span-1">
          <Card className="card h-full" data-testid="recent-achievements-section">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No recent activity yet.
                </div>
              ) : (
                recentActivity.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${event.type === 'winner'
                      ? 'bg-[#CDDC39]'
                      : 'bg-indigo-100'
                      }`}>
                      {event.type === 'winner' ? (
                        <Trophy className="w-5 h-5 text-gray-900" />
                      ) : (
                        <Award className="w-5 h-5 text-[#3F51B5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#333333] truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={event.type === 'winner'
                            ? 'bg-[#CDDC39]/20 text-gray-900 border-[#CDDC39]'
                            : 'bg-indigo-50 text-[#3F51B5] border-indigo-200'
                          }
                        >
                          {event.type === 'winner' ? 'Winner' : 'Participant'}
                        </Badge>
                        {/* Only show points if they exist/are calculated */}
                        {event.pointsEarned && (
                          <span className="text-xs font-semibold text-[#009688]">
                            +{event.pointsEarned} pts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <div className="md:col-span-1">
          <Card className="card bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] text-white border-0 shadow-lg h-full" data-testid="quick-action-card">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">
                Explore Events
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Discover new opportunities to earn points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student/events">
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-[#3F51B5] font-bold shadow-md"
                  data-testid="browse-events-button"
                >
                  Browse All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;