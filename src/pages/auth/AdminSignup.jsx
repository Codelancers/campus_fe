import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { registerAdmin } from '@/lib/api';
import { setUserData } from '@/lib/token';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
      };

      const response = await registerAdmin(registrationData);
      
      // Store the response body in localStorage
      setUserData(response);
      
      toast.success('Account created! OTP sent to your email.');
      navigate('/admin123/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8" data-testid="admin-signup-header">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-[#3F51B5]" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-indigo-100 text-lg">
            Create your admin account
          </p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-2xl border-0" data-testid="admin-signup-card">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
              Admin Registration
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
                    placeholder="Super Admin"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                    data-testid="name-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#333333]">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@college.edu"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-11 h-11 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                    data-testid="email-input"
                    required
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
                  onClick={() => navigate('/admin123/login')}
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

export default AdminSignup;

