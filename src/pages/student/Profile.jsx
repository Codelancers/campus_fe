import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Calendar, Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';
import { getUser, updateUser } from '@/lib/token';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    rollNumber: '',
    year: '',
  });

  const [stats, setStats] = useState({
    totalPoints: 0,
    eventsAttended: 0,
    eventsWon: 0,
    certificates: 0,
    joinedDate: '2025-01-01',
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        branch: user.department || user.branch || '',
        rollNumber: user.rollNumber || 'Not Assigned',
        year: user.year ? String(user.year) + (String(user.year).endsWith('1') ? 'st' : String(user.year).endsWith('2') ? 'nd' : String(user.year).endsWith('3') ? 'rd' : 'th') + ' Year' : '',
      });

      // If user has stats in local storage, use them, otherwise default
      if (user.stats) {
        setStats(user.stats);
      } else {
        // Mock stats if not present
        setStats({
          totalPoints: user.points || 0,
          eventsAttended: 0,
          eventsWon: 0,
          certificates: 0,
          joinedDate: new Date().toISOString().split('T')[0],
        });
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const currentUser = getUser();
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.branch, // Map back to department
        // Parse year back to number if needed, or keep as string depending on backend
        // For now, let's keep it simple. The select values are "1st Year", etc.
        // We might want to store just the number.
        year: parseInt(formData.year) || formData.year,
      };

      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8" data-testid="student-profile">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
          My Profile
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <Card className="card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-[#3F51B5]">
                  <AvatarImage src="" alt={formData.name} />
                  <AvatarFallback className="bg-[#3F51B5] text-white text-3xl font-bold">
                    {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-2xl font-heading font-bold text-[#333333]">
                    {formData.name}
                  </h2>
                  <p className="text-gray-500">{formData.email}</p>
                  <Badge className="mt-2 bg-[#009688] text-white border-0">
                    {formData.branch}
                  </Badge>
                </div>

                <div className="w-full pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {stats.joinedDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="card mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold text-[#333333]">
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#CDDC39] rounded-full">
                    <Trophy className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="text-gray-700">Total Points</span>
                </div>
                <span className="text-2xl font-heading font-bold text-[#333333]">
                  {stats.totalPoints}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                    <Calendar className="w-5 h-5 text-[#3F51B5]" />
                  </div>
                  <span className="text-gray-700">Events Attended</span>
                </div>
                <span className="text-2xl font-heading font-bold text-[#333333]">
                  {stats.eventsAttended}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#CDDC39] rounded-full">
                    <Trophy className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="text-gray-700">Events Won</span>
                </div>
                <span className="text-2xl font-heading font-bold text-[#333333]">
                  {stats.eventsWon}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#009688]/20 rounded-full">
                    <Award className="w-5 h-5 text-[#009688]" />
                  </div>
                  <span className="text-gray-700">Certificates</span>
                </div>
                <span className="text-2xl font-heading font-bold text-[#333333]">
                  {stats.certificates}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-bold text-[#333333]">
                Edit Profile
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-[#333333]">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="pl-11 h-11 bg-gray-50"
                        data-testid="profile-name-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-[#333333]">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="pl-11 h-11 bg-gray-50"
                        data-testid="profile-email-input"
                        disabled // Email usually shouldn't be changed easily
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-[#333333]">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="pl-11 h-11 bg-gray-50"
                        data-testid="profile-phone-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-sm font-semibold text-[#333333]">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => handleChange('rollNumber', e.target.value)}
                      className="h-11 bg-gray-50"
                      data-testid="profile-roll-input"
                      disabled // Roll number usually shouldn't be changed
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-sm font-semibold text-[#333333]">
                      Branch
                    </Label>
                    <Select value={formData.branch} onValueChange={(value) => handleChange('branch', value)}>
                      <SelectTrigger className="h-11 bg-gray-50" data-testid="profile-branch-select">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold text-[#333333]">
                      Year
                    </Label>
                    <Select value={formData.year} onValueChange={(value) => handleChange('year', value)}>
                      <SelectTrigger className="h-11 bg-gray-50" data-testid="profile-year-select">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="btn-primary"
                    data-testid="save-profile-button"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300"
                    data-testid="cancel-profile-button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;