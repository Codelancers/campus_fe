import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { verifyUserOTP, sendUserOTP } from '@/lib/api';
import { setToken, setUserData, decodeToken } from '@/lib/token';

const OTPVerification = () => {
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

    setLoading(true);

    try {
      const response = await verifyUserOTP(email, otp);
      
      // Store JWT token
      const token = response.token;
      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token in localStorage
      setToken(token);

      // Store full response in localStorage
      setUserData(response);

      // Extract role from JWT token or response
      let role = response.role;
      
      // If role is not in response, try to decode from JWT
      if (!role) {
        const decoded = decodeToken(token);
        role = decoded?.role || decoded?.userRole || decoded?.type;
      }
      
      // Default to STUDENT if role is still not found
      if (!role) {
        role = 'STUDENT';
      }
      
      // Normalize role to uppercase
      role = role.toUpperCase();
      
      // Store role separately for easy access
      localStorage.setItem('role', role);

      toast.success('Login successful!');

      // Navigate based on role
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'STUDENT') {
        navigate('/student');
      } else {
        // Default to student if role is unknown
        navigate('/student');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendUserOTP(email);
      toast.success('New OTP sent to your email!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F51B5] via-[#5C6BC0] to-[#7986CB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0" data-testid="otp-verification-card">
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
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                data-testid="otp-input"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
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
              onClick={() => navigate(-1)}
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

export default OTPVerification;
