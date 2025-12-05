import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Shield, Users, LayoutDashboard, Award } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminData, updateAdmin } from '@/lib/token';

const AdminProfile = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
    });

    const [stats, setStats] = useState({
        eventsCreated: 0,
        usersManaged: 0,
        activeEvents: 0,
        certificatesIssued: 0,
        joinedDate: '2025-01-01',
    });

    useEffect(() => {
        const admin = getAdminData();
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                role: admin.role || 'Administrator',
            });

            // Mock stats for admin as they are usually calculated from backend
            setStats({
                eventsCreated: admin.eventsCreated || 12,
                usersManaged: admin.usersManaged || 150,
                activeEvents: admin.activeEvents || 5,
                certificatesIssued: admin.certificatesIssued || 45,
                joinedDate: new Date().toISOString().split('T')[0],
            });
        }
        setLoading(false);
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const currentAdmin = getAdminData();
            const updatedAdmin = {
                ...currentAdmin,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                // Role usually shouldn't be changed by the admin themselves easily
            };

            updateAdmin(updatedAdmin);
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
        <div className="space-y-8" data-testid="admin-profile">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#333333] tracking-tight">
                    Admin Profile
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Manage your administrative account
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
                                    <Badge className="mt-2 bg-[#3F51B5] text-white border-0">
                                        {formData.role}
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
                                Admin Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-[#CDDC39] rounded-full">
                                        <LayoutDashboard className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <span className="text-gray-700">Events Created</span>
                                </div>
                                <span className="text-2xl font-heading font-bold text-[#333333]">
                                    {stats.eventsCreated}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                                        <Users className="w-5 h-5 text-[#3F51B5]" />
                                    </div>
                                    <span className="text-gray-700">Users Managed</span>
                                </div>
                                <span className="text-2xl font-heading font-bold text-[#333333]">
                                    {stats.usersManaged}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-[#CDDC39] rounded-full">
                                        <Calendar className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <span className="text-gray-700">Active Events</span>
                                </div>
                                <span className="text-2xl font-heading font-bold text-[#333333]">
                                    {stats.activeEvents}
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
                                    {stats.certificatesIssued}
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
                                                disabled
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
                                        <Label htmlFor="role" className="text-sm font-semibold text-[#333333]">
                                            Role
                                        </Label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                id="role"
                                                type="text"
                                                value={formData.role}
                                                className="pl-11 h-11 bg-gray-50"
                                                disabled
                                            />
                                        </div>
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

export default AdminProfile;
