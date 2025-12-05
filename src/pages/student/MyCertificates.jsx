import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const MyCertificates = () => {
  const certificates = [
    {
      id: 1,
      eventName: 'Tech Hackathon 2024',
      type: 'winner',
      date: '2024-12-15',
      points: 3,
    },
    {
      id: 2,
      eventName: 'Workshop: AI & ML',
      type: 'participant',
      date: '2024-12-20',
      points: 2,
    },
    {
      id: 3,
      eventName: 'Code Sprint Championship',
      type: 'winner',
      date: '2025-01-10',
      points: 3,
    },
    {
      id: 4,
      eventName: 'Design Thinking Workshop',
      type: 'participant',
      date: '2025-01-25',
      points: 2,
    },
  ];

  const handleDownload = (certificateId) => {
    console.log('Downloading certificate:', certificateId);
    // TODO: Implement certificate download
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      data-testid="my-certificates"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
          My Certificates
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Your achievements and participation records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Certificates</CardTitle>
            <Award className="w-5 h-5 text-[#3F51B5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {certificates.length}
            </div>
          </CardContent>
        </Card>

        <Card className="card bg-gradient-to-br from-[#CDDC39] to-[#C0CA33] border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Winning Certificates</CardTitle>
            <Trophy className="w-5 h-5 text-gray-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-gray-900">
              {certificates.filter(c => c.type === 'winner').length}
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Participation Certificates</CardTitle>
            <Award className="w-5 h-5 text-[#009688]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-[#333333]">
              {certificates.filter(c => c.type === 'participant').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card hover:shadow-lg transition-shadow duration-200" data-testid={`certificate-${cert.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-heading font-bold text-[#333333] mb-2">
                      {cert.eventName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      Issued on {cert.date}
                    </CardDescription>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    cert.type === 'winner'
                      ? 'bg-[#CDDC39]'
                      : 'bg-indigo-100'
                  }`}>
                    {cert.type === 'winner' ? (
                      <Trophy className="w-6 h-6 text-gray-900" />
                    ) : (
                      <Award className="w-6 h-6 text-[#3F51B5]" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cert.type === 'winner'
                      ? 'bg-[#CDDC39] text-gray-900 border-0'
                      : 'bg-indigo-100 text-[#3F51B5] border-indigo-200'
                    }
                  >
                    {cert.type === 'winner' ? 'Winner' : 'Participant'}
                  </Badge>
                  <span className="text-sm font-semibold text-[#009688]">
                    +{cert.points} points
                  </span>
                </div>

                <Button
                  onClick={() => handleDownload(cert.id)}
                  className="w-full border-[#3F51B5] text-[#3F51B5] hover:bg-indigo-50"
                  variant="outline"
                  data-testid={`download-certificate-${cert.id}-button`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyCertificates;