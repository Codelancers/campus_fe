import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, ArrowLeft, Home } from 'lucide-react';

const PageUnderConstruction = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const dashboardPath = role === 'ADMIN' ? '/admin' : '/student';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-12 text-center space-y-6">
          {/* Construction Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] rounded-full">
                <Wrench className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-heading font-bold text-[#333333]">
              Page Under Construction
            </h1>
            <p className="text-gray-600 text-lg">
              We're working hard to bring you this feature!
            </p>
            <p className="text-gray-500 text-sm">
              This page is currently being developed and will be available soon.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={() => navigate(dashboardPath)}
              className="bg-[#3F51B5] hover:bg-[#303F9F] text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-[#3F51B5] text-[#3F51B5] hover:bg-indigo-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageUnderConstruction;

