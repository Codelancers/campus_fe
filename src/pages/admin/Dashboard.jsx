import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Award, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { getAdminData } from '@/lib/token';
import { getAllEvents, getUsersByDepartment } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = getAdminData();
  const adminName = admin ? admin.name.split(' ')[0] : 'Admin';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEvents: 0,
    activeEvents: 0,
    certificatesIssued: 0, // Still mock as no API exists yet
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [branchDistribution, setBranchDistribution] = useState([]);
  const [registrationTrendData, setRegistrationTrendData] = useState([]); // Mock trend for now
  const [monthlyEventsData, setMonthlyEventsData] = useState([]); // Mock monthly for now

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Users and Events in parallel for speed
        const [usersRes, eventsRes] = await Promise.all([
          getUsersByDepartment('ALL'),
          getAllEvents()
        ]);

        // 1. Process Users
        const users = (usersRes.success && Array.isArray(usersRes.data)) ? usersRes.data : [];
        const totalStudents = users.length;

        // Process Branch Distribution from Users
        const deptCounts = users.reduce((acc, user) => {
          // Normalize department names if needed
          const dept = user.department || 'Unknown';
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        const branchDistData = Object.keys(deptCounts).map((dept, index) => ({
          name: dept,
          value: deptCounts[dept],
          color: getColorForIndex(index)
        }));
        setBranchDistribution(branchDistData);


        // 2. Process Events
        const events = (eventsRes.data && Array.isArray(eventsRes.data)) ? eventsRes.data : [];
        const totalEvents = events.length;

        // Active Events: Today and Tomorrow (Not yesterday)
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2); // 2 days from midnight means end of tomorrow roughly

        const activeEventsCount = events.filter(event => {
          if (!event.startTime) return false;
          const eventDate = new Date(event.startTime);
          return eventDate >= startOfToday && eventDate < endOfTomorrow;
        }).length;

        // Recent Events (Last 3 created)
        // Assuming events are sorted by creation or start time. Let's sort by creation (desc) if available, else startTime
        const sortedEvents = [...events].sort((a, b) => {
          // Prefer created_at if reliable, else startTime
          return new Date(b.created_at || b.startTime) - new Date(a.created_at || a.startTime);
        });

        const recent3 = sortedEvents.slice(0, 3).map(ev => ({
          id: ev.id || ev.eventId,
          title: ev.title,
          registrations: ev.count || 0, // Using 'count' from API response
          date: new Date(ev.startTime).toLocaleDateString(),
          status: new Date(ev.startTime) > new Date() ? 'upcoming' : 'completed'
        }));
        setRecentEvents(recent3);

        setStats({
          totalStudents,
          totalEvents,
          activeEvents: activeEventsCount,
          certificatesIssued: 125, // Mocked
        });

        // Mock chart 
        setMonthlyEventsData([
          { month: 'Aug', events: 5 },
          { month: 'Sep', events: 8 },
          { month: 'Oct', events: 12 },
          { month: 'Nov', events: 10 },
          { month: 'Dec', events: 15 },
          { month: 'Jan', events: totalEvents }, // Show current total roughly
        ]);

        setRegistrationTrendData([
          { month: 'Aug', registrations: 50 },
          { month: 'Sep', registrations: 80 },
          { month: 'Oct', registrations: 120 },
          { month: 'Nov', registrations: 150 },
          { month: 'Dec', registrations: 200 },
          { month: 'Jan', registrations: 200 + users.length },
        ]);


      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColorForIndex = (index) => {
    const colors = ['#3F51B5', '#009688', '#CDDC39', '#5C6BC0', '#FF9800', '#E91E63', '#9C27B0'];
    return colors[index % colors.length];
  };

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
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight dark:text-white">
            Welcome Back, {adminName}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage events, users, and campus activities
          </p>
        </div>
        <Button
          onClick={() => navigate('/admin/events/create')}
          className="btn-accent"
          data-testid="create-event-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card" data-testid="total-students-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</CardTitle>
                <Users className="w-5 h-5 text-[#3F51B5]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-[#333333] dark:text-white">
                  {stats.totalStudents.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#009688]" />
                  Registered Users
                </p>
              </CardContent>
            </Card>

            <Card className="card" data-testid="total-events-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</CardTitle>
                <Calendar className="w-5 h-5 text-[#3F51B5]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-[#333333] dark:text-white">
                  {stats.totalEvents}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  All listed events
                </p>
              </CardContent>
            </Card>

            <Card className="card bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] text-white border-0" data-testid="active-events-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-indigo-100">Active Events (Today/Tmrw)</CardTitle>
                <Calendar className="w-5 h-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">
                  {stats.activeEvents}
                </div>
                <button
                  onClick={() => navigate('/admin/events')}
                  className="text-xs text-indigo-100 hover:underline mt-1 inline-block"
                >
                  Manage events →
                </button>
              </CardContent>
            </Card>

            <Card className="card" data-testid="certificates-issued-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Issued</CardTitle>
                <Award className="w-5 h-5 text-[#009688]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-[#333333] dark:text-white">
                  {stats.certificatesIssued.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lifetime total (Mock)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Events Chart */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-xl font-heading font-bold text-[#333333] dark:text-white">
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
                <CardTitle className="text-xl font-heading font-bold text-[#333333] dark:text-white">
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
                <CardTitle className="text-xl font-heading font-bold text-[#333333] dark:text-white">
                  Branch Distribution
                </CardTitle>
                <CardDescription>Students by branch</CardDescription>
              </CardHeader>
              <CardContent>
                {branchDistribution.length > 0 ? (
                  <>
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
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                      {branchDistribution.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                          </div>
                          <span className="font-semibold text-[#333333] dark:text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    No student data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="card lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-heading font-bold text-[#333333] dark:text-white">
                      Recent Events
                    </CardTitle>
                    <CardDescription>Latest event activities</CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate('/admin/events')}
                    variant="outline"
                    size="sm"
                    className="border-[#3F51B5] text-[#3F51B5]"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentEvents.length > 0 ? (
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#3F51B5] hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-base text-[#333333] dark:text-white mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
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
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    No recent events found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;