import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { sendUserOTP } from '@/lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await sendUserOTP(email);
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      console.error('Send OTP error:', error);

      // Handle different error formats
      let errorMessage = 'Failed to send OTP. Please try again.';

      if (error.message) {
        // Check if it's "user not found" error
        if (error.message.toLowerCase().includes('user not found')) {
          errorMessage = 'User not found. Please check your email or create an account.';
        } else {
          errorMessage = error.message;
        }
      } else if (error.response?.data) {
        // Handle string response
        if (typeof error.response.data === 'string') {
          const errorData = error.response.data.toLowerCase();
          if (errorData.includes('user not found')) {
            errorMessage = 'User not found. Please check your email or create an account.';
          } else {
            errorMessage = error.response.data;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8" data-testid="login-header">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Campus Events
          </h1>
          <p className="text-indigo-100 text-lg">
            Your Gateway to Campus Activities
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0" data-testid="login-card">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email to receive a one-time password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#333333]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-gray-50 border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/20"
                    data-testid="email-input"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#3F51B5] hover:bg-[#303F9F] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
                data-testid="send-otp-button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-medium">New here?</span>
              </div>
            </div>

            {/* Signup Link */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 border-indigo-100 text-[#3F51B5] hover:bg-indigo-50 font-semibold"
              onClick={() => navigate('/signup')}
              data-testid="signup-link"
            >
              Create Student Account
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-indigo-100 text-sm mt-6">
          © 2025 Campus Events. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;