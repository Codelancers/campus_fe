import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { verifyAdminOTP, sendAdminOTP } from '@/lib/api';
import { setToken, setUserData } from '@/lib/token';

const AdminOTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    if (!email) {
      toast.error('Email is missing. Please go back and try again.');
      return;
    }

    setLoading(true);

    try {
      // Log the request data for debugging
      console.log('Verifying admin OTP:', { email, otp, otpType: typeof otp });

      const response = await verifyAdminOTP(email, otp);

      console.log('Admin OTP verification response:', response);
      console.log('Response status:', response.status);

      // Check if status is 200 (success)
      if (response.status === 200) {
        // Extract response data - handle both string token and object response
        let responseData = response.responseData || response;
        let token = response.token || responseData?.token;

        // If response is a string (direct token)
        if (typeof responseData === 'string') {
          token = responseData;
          responseData = { token: responseData };
        }

        if (!token) {
          console.error('No token in response:', response);
          throw new Error('No token received from server');
        }

        // Check if roles array contains "ADMIN"
        const roles = responseData?.roles || responseData?.admin?.roles || [];
        const hasAdminRole = Array.isArray(roles) && roles.includes('ADMIN');

        if (!hasAdminRole) {
          toast.error('These are not admin credentials. Please use admin login.');
          setLoading(false);
          return;
        }

        console.log('Token extracted successfully:', token.substring(0, 20) + '...');
        console.log('Full response data:', responseData);

        // Store token in localStorage
        setToken(token, 'ADMIN');

        // Store full response in localStorage (token, admin, user, roles, etc.)
        setUserData({
          token: token,
          ...responseData
        });

        // Set role as ADMIN
        localStorage.setItem('role', 'ADMIN');

        toast.success('Login successful!');

        // Navigate to admin dashboard immediately after successful 200 response
        navigate('/admin', { replace: true });
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);

      // Handle different error formats
      let errorMessage = 'Invalid OTP. Please try again.';

      if (error.message) {
        // Check if it's "admin not found" error
        if (error.message.toLowerCase().includes('admin not found')) {
          errorMessage = 'Admin not found. Please check your credentials.';
        } else {
          errorMessage = error.message;
        }
      } else if (error.response?.data) {
        // Handle string response
        if (typeof error.response.data === 'string') {
          const errorData = error.response.data.toLowerCase();
          if (errorData.includes('admin not found')) {
            errorMessage = 'Admin not found. Please check your credentials.';
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

  const handleResend = async () => {
    try {
      await sendAdminOTP(email);
      toast.success('New OTP sent to your email!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0" data-testid="admin-otp-verification-card">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#3F51B5]" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-[#333333] text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-base text-center">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold text-[#3F51B5]">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                data-testid="otp-input"
              >
                <InputOTPGroup className="gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-14 text-2xl font-bold border-2 border-gray-200 bg-white rounded-xl focus:border-[#3F51B5] focus:ring-4 focus:ring-[#3F51B5]/10 shadow-sm transition-all duration-200 first:rounded-xl last:rounded-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full h-12 bg-[#3F51B5] hover:bg-[#303F9F] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
              data-testid="verify-otp-button"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                onClick={handleResend}
                className="text-[#3F51B5] font-semibold"
                data-testid="resend-otp-button"
              >
                Resend OTP
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/admin123/login')}
              className="w-full text-gray-600 hover:text-gray-900"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOTPVerification;

