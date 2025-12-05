import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Award } from 'lucide-react';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock event data
  const event = {
    id: 1,
    title: 'Tech Hackathon 2025',
    description: 'Join us for an exciting 24-hour hackathon where you can build innovative solutions to real-world problems. Work in teams, learn new technologies, and compete for amazing prizes!',
    longDescription: 'This hackathon is designed to bring together the brightest minds in technology to solve challenging problems. Participants will have access to mentors, workshops, and resources throughout the event. Categories include AI/ML, Web Development, Mobile Apps, and IoT. The winning teams will receive cash prizes, certificates, and opportunities for internships.',
    date: '2025-02-15',
    time: '09:00 AM',
    venue: 'Auditorium Hall',
    branch: 'All Branches',
    participants: 45,
    maxParticipants: 100,
    registrationDeadline: '2025-02-10',
    registered: false,
    image: 'https://images.unsplash.com/photo-1646579885920-0c9a01cb7078',
    prizes: ['1st Prize: $1000', '2nd Prize: $500', '3rd Prize: $250'],
    requirements: ['Laptop', 'Student ID', 'Team of 2-4 members'],
  };

  const handleRegister = () => {
    toast.success('Successfully registered for the event!');
  };

  return (
    <div className="space-y-6" data-testid="event-details">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-900"
        data-testid="back-button"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header Card */}
      <Card className="card overflow-hidden">
        <div className="relative h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-[#CDDC39] text-gray-900 border-0">
                {event.branch}
              </Badge>
              {event.registered && (
                <Badge className="bg-[#009688] text-white border-0">
                  Registered
                </Badge>
              )}
            </div>
            <h1 className="text-5xl font-heading font-bold mb-3">{event.title}</h1>
            <p className="text-lg text-gray-200 max-w-3xl">{event.description}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
                About This Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 text-base leading-relaxed">
                {event.longDescription}
              </p>

              <div>
                <h3 className="text-xl font-heading font-semibold text-[#333333] mb-3">
                  Prizes & Rewards
                </h3>
                <ul className="space-y-2">
                  {event.prizes.map((prize, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <Award className="w-5 h-5 text-[#CDDC39]" />
                      <span>{prize}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold text-[#333333] mb-3">
                  What to Bring
                </h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-[#3F51B5] rounded-full" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info Card */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#3F51B5] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-[#333333]">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#3F51B5] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-[#333333]">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3F51B5] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium text-[#333333]">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#3F51B5] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-[#333333]">
                      {event.participants} / {event.maxParticipants}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Registration Deadline</p>
                <p className="font-medium text-[#333333]">{event.registrationDeadline}</p>
              </div>
            </CardContent>
          </Card>

          {/* Registration Card */}
          <Card className="card bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] text-white border-0">
            <CardContent className="pt-6">
              {event.registered ? (
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-xl">You're Registered!</h3>
                  <p className="text-indigo-100">See you at the event</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">Ready to Join?</h3>
                    <p className="text-indigo-100 text-sm">
                      Register now and earn 2 points! Win to earn 3 more points.
                    </p>
                  </div>
                  <Button
                    onClick={handleRegister}
                    className="w-full bg-[#CDDC39] hover:bg-[#C0CA33] text-gray-900 font-bold h-12 shadow-lg"
                    data-testid="register-button"
                  >
                    Register for Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;