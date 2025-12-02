import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
];

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    rollNumber: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.branch) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    // API call to create account and send OTP
    setTimeout(() => {
      setLoading(false);
      toast.success('Account created! OTP sent to your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8" data-testid="signup-header">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-10 h-10 text-[#3F51B5]" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Join Campus Events
          </h1>
          <p className="text-indigo-100 text-lg">
            Create your student account to get started
          </p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-2xl border-0" data-testid="signup-card">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
              Student Registration
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[#333333]">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                    data-testid="name-input"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-[#333333]">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@college.edu"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                      data-testid="email-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-[#333333]">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                      data-testid="phone-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Branch & Roll Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-semibold text-[#333333]">
                    Branch *
                  </Label>
                  <Select value={formData.branch} onValueChange={(value) => handleChange('branch', value)}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200" data-testid="branch-select">
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-sm font-semibold text-[#333333]">
                    Roll Number
                  </Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="CS2021001"
                    value={formData.rollNumber}
                    onChange={(e) => handleChange('rollNumber', e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                    data-testid="roll-number-input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#3F51B5] hover:bg-[#303F9F] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 mt-6"
                disabled={loading}
                data-testid="signup-submit-button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Button
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="text-[#3F51B5] font-semibold p-0 h-auto"
                  data-testid="login-link"
                >
                  Sign In
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentSignup;