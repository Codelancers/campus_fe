import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUser } from '@/lib/token';

const StudentDashboard = () => {
  const user = getUser();
  const userName = user ? user.name.split(' ')[0] : 'Student';

  // Mock data
  const stats = {
    totalPoints: 0,
    eventsRegistered: 0,
    eventsWon: 0,
    certificates: 0,
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Hackathon 2025',
      date: '2025-02-15',
      time: '09:00 AM',
      venue: 'Auditorium Hall',
      branch: 'All Branches',
      participants: 45,
      registered: true,
      image: 'https://images.unsplash.com/photo-1646579885920-0c9a01cb7078',
    },
    {
      id: 2,
      title: 'Workshop: AI & ML',
      date: '2025-02-20',
      time: '02:00 PM',
      venue: 'Lab 301',
      branch: 'Computer Science',
      participants: 30,
      registered: false,
      image: 'https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d',
    },
  ];

  const recentAchievements = [
    { event: 'Code Sprint 2024', type: 'winner', points: 3, date: '2025-01-28' },
    { event: 'Design Thinking Workshop', type: 'participant', points: 2, date: '2025-01-25' },
    { event: 'Music Fest', type: 'winner', points: 3, date: '2025-01-20' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

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
              +6 from last month
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
            <Progress value={60} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="card" data-testid="won-events-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Events Won</CardTitle>
            <Award className="w-5 h-5 text-[#009688]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.eventsWon}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.eventsWon / stats.eventsRegistered) * 100).toFixed(0)}% win rate
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

      {/* Bento Grid Layout */}
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
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#3F51B5] hover:shadow-md transition-all duration-200 group"
                  data-testid={`upcoming-event-${event.id}`}
                >
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {event.registered && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[#009688] text-white border-0">Registered</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-lg text-[#333333] mb-2 truncate">
                      {event.title}
                    </h3>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#3F51B5]" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#3F51B5]" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#3F51B5]" />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>
                    {!event.registered && (
                      <Button
                        className="mt-3 btn-accent h-9 text-sm"
                        data-testid={`register-event-${event.id}-button`}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div className="md:col-span-1">
          <Card className="card h-full" data-testid="recent-achievements-section">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                Recent Achievements
              </CardTitle>
              <CardDescription>Your latest wins & participations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  data-testid={`achievement-${index}`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${achievement.type === 'winner'
                      ? 'bg-[#CDDC39]'
                      : 'bg-indigo-100'
                    }`}>
                    {achievement.type === 'winner' ? (
                      <Trophy className="w-5 h-5 text-gray-900" />
                    ) : (
                      <Award className="w-5 h-5 text-[#3F51B5]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#333333] truncate">
                      {achievement.event}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={achievement.type === 'winner'
                          ? 'bg-[#CDDC39]/20 text-gray-900 border-[#CDDC39]'
                          : 'bg-indigo-50 text-[#3F51B5] border-indigo-200'
                        }
                      >
                        {achievement.type}
                      </Badge>
                      <span className="text-xs font-semibold text-[#009688]">
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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