import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { registerUser } from '@/lib/api';
import { setUserData } from '@/lib/token';

const BRANCHES = [
  'CSE',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'CSE-ALLIED BRANCHES',
];

const YEARS = [
  { label: '1st Year', value: 1 },
  { label: '2nd Year', value: 2 },
  { label: '3rd Year', value: 3 },
  { label: '4th Year', value: 4 },
];

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    department: '', // Changed from branch to department for consistency
    year: '',
  });

  const handleChange = (field, value) => {
    // If field is rollNo, force uppercase to match DB/standard format
    if (field === 'rollNo') {
      setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: numericValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.rollNo || !formData.email || !formData.phone || !formData.department || !formData.year) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate phone number is exactly 10 digits
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      // Explicitly construct the payload to match the backend expectation exactly
      const registrationData = {
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim().toUpperCase(), // Ensure Roll No is sent as 'rollNo'
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department, // Mapped correctly
        year: parseInt(formData.year), // Ensure number
      };

      console.log('Sending Registration Payload:', JSON.stringify(registrationData, null, 2));

      const response = await registerUser(registrationData);

      console.log('Registration Response:', response);

      // Store the response body in localStorage
      setUserData(response);

      toast.success('Account created! OTP sent to your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8" data-testid="signup-header">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
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
              {/* Name & Roll No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-[#333333]">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      name="name"
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

                <div className="space-y-2">
                  <Label htmlFor="rollNo" className="text-sm font-semibold text-[#333333]">
                    Roll Number *
                  </Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="rollNo"
                      name="rollNo"
                      type="text"
                      placeholder="21BQ1A42A1"
                      value={formData.rollNo}
                      onChange={(e) => handleChange('rollNo', e.target.value)}
                      className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20 uppercase"
                      data-testid="roll-no-input"
                      required
                    />
                  </div>
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
                      name="email"
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
                      name="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                      data-testid="phone-input"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Branch & Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold text-[#333333]">
                    Branch *
                  </Label>
                  <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200" data-testid="branch-select">
                      <SelectValue placeholder="Select Branch" />
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
                  <Label htmlFor="year" className="text-sm font-semibold text-[#333333]">
                    Year *
                  </Label>
                  <Select value={formData.year} onValueChange={(value) => handleChange('year', value)}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200" data-testid="year-select">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year.value} value={String(year.value)}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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