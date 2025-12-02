import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Award, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalStudents: 1250,
    totalEvents: 48,
    activeEvents: 12,
    certificatesIssued: 3420,
  };

  const monthlyEventsData = [
    { month: 'Aug', events: 8 },
    { month: 'Sep', events: 12 },
    { month: 'Oct', events: 10 },
    { month: 'Nov', events: 15 },
    { month: 'Dec', events: 18 },
    { month: 'Jan', events: 20 },
  ];

  const registrationTrendData = [
    { month: 'Aug', registrations: 120 },
    { month: 'Sep', registrations: 150 },
    { month: 'Oct', registrations: 180 },
    { month: 'Nov', registrations: 210 },
    { month: 'Dec', registrations: 250 },
    { month: 'Jan', registrations: 280 },
  ];

  const branchDistribution = [
    { name: 'Computer Science', value: 350, color: '#3F51B5' },
    { name: 'IT', value: 280, color: '#009688' },
    { name: 'ECE', value: 220, color: '#CDDC39' },
    { name: 'Mechanical', value: 200, color: '#5C6BC0' },
    { name: 'Others', value: 200, color: '#94A3B8' },
  ];

  const recentEvents = [
    { id: 1, title: 'Tech Hackathon 2025', registrations: 45, date: '2025-02-15', status: 'upcoming' },
    { id: 2, title: 'AI Workshop', registrations: 30, date: '2025-02-20', status: 'upcoming' },
    { id: 3, title: 'Code Sprint', registrations: 85, date: '2025-01-28', status: 'completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      data-testid="admin-dashboard"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage events, users, and campus activities
          </p>
        </div>
        <Link to="/admin/events/create">
          <Button className="btn-accent" data-testid="create-event-button">
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card" data-testid="total-students-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="w-5 h-5 text-[#3F51B5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#009688]" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card" data-testid="total-events-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            <Calendar className="w-5 h-5 text-[#3F51B5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.totalEvents}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeEvents} active events
            </p>
          </CardContent>
        </Card>

        <Card className="card bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] text-white border-0" data-testid="active-events-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {stats.activeEvents}
            </div>
            <Link to="/admin/events" className="text-xs text-indigo-100 hover:underline mt-1 inline-block">
              Manage events →
            </Link>
          </CardContent>
        </Card>

        <Card className="card" data-testid="certificates-issued-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates Issued</CardTitle>
            <Award className="w-5 h-5 text-[#009688]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {stats.certificatesIssued.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lifetime total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Events Chart */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-bold text-[#333333]">
              Monthly Events
            </CardTitle>
            <CardDescription>Events created per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEventsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="events" fill="#3F51B5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Registration Trend Chart */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-bold text-[#333333]">
              Registration Trend
            </CardTitle>
            <CardDescription>Student registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#009688"
                  strokeWidth={3}
                  dot={{ fill: '#009688', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Distribution */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-bold text-[#333333]">
              Branch Distribution
            </CardTitle>
            <CardDescription>Students by branch</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={branchDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {branchDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {branchDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-[#333333]">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                  Recent Events
                </CardTitle>
                <CardDescription>Latest event activities</CardDescription>
              </div>
              <Link to="/admin/events">
                <Button variant="outline" size="sm" className="border-[#3F51B5] text-[#3F51B5]">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#3F51B5] hover:shadow-sm transition-all duration-200"
                  data-testid={`recent-event-${event.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-base text-[#333333] mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.registrations} registrations</span>
                    </div>
                  </div>
                  <Badge
                    className={event.status === 'upcoming'
                      ? 'bg-[#CDDC39] text-gray-900 border-0'
                      : 'bg-[#009688] text-white border-0'
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;