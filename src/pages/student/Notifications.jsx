import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Award, CheckCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'event',
      title: 'New Event: Tech Hackathon 2025',
      message: 'A new hackathon event has been added. Register now to participate!',
      time: '2 hours ago',
      read: false,
      icon: Calendar,
    },
    {
      id: 2,
      type: 'certificate',
      title: 'Certificate Ready',
      message: 'Your participation certificate for "AI Workshop" is ready to download.',
      time: '5 hours ago',
      read: false,
      icon: Award,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Event Reminder',
      message: 'Workshop: AI & ML starts tomorrow at 2:00 PM. Don\'t forget!',
      time: '1 day ago',
      read: true,
      icon: Bell,
    },
    {
      id: 4,
      type: 'event',
      title: 'Event Registration Confirmed',
      message: 'You have successfully registered for "Annual Cultural Fest".',
      time: '2 days ago',
      read: true,
      icon: Calendar,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      data-testid="notifications-page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
            Notifications
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Stay updated with campus events and activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="border-[#3F51B5] text-[#3F51B5]"
            data-testid="mark-all-read-button"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <Card className="card bg-indigo-50 border-indigo-200">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-[#3F51B5]">
              You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="card">
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`card ${
                  !notification.read ? 'border-l-4 border-l-[#3F51B5] bg-indigo-50/30' : ''
                }`}
                data-testid={`notification-${notification.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                      !notification.read ? 'bg-[#3F51B5]' : 'bg-gray-100'
                    }`}>
                      <notification.icon className={`w-6 h-6 ${
                        !notification.read ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-[#333333] mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <Badge className="bg-[#CDDC39] text-gray-900 border-0">
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="border-[#3F51B5] text-[#3F51B5] hover:bg-indigo-50"
                            data-testid={`mark-read-${notification.id}-button`}
                          >
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-${notification.id}-button`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;