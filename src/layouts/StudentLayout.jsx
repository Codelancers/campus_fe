import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Calendar,
  Award,
  Bell,
  User,
  LogOut,
  Menu,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { getUser } from '@/lib/token';

const navigation = [
  { name: 'Dashboard', href: '/student', icon: Home },
  { name: 'Events', href: '/student/events', icon: Calendar },
  { name: 'Certificates', href: '/student/certificates', icon: Award },
  { name: 'Notifications', href: '/student/notifications', icon: Bell, badge: 3 },
];

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user data from local storage
  const [user] = useState(() => {
    const storedUser = getUser();
    return storedUser || {
      name: 'Student',
      email: 'student@college.edu',
      branch: 'General',
      points: 0,
      avatar: null,
    };
  });

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavigation = (href, mobile = false) => {
    if (mobile) setMobileMenuOpen(false);
    navigate(href);
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href, mobile)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left ${isActive
              ? 'bg-[#3F51B5] text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
            data-testid={`nav-${item.name.toLowerCase()}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
            {item.badge && (
              <Badge className="ml-auto bg-[#CDDC39] text-gray-900 hover:bg-[#C0CA33]">
                {item.badge}
              </Badge>
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="mobile-menu-button">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-lg text-[#333333]">Campus Events</h2>
                        <p className="text-xs text-gray-500">Student Portal</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-4 space-y-1">
                    <NavItems mobile />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/student" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="hidden sm:block font-heading font-bold text-xl text-[#333333]">
                Campus Events
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Points Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#CDDC39] to-[#C0CA33] rounded-full shadow-md">
              <Trophy className="w-5 h-5 text-gray-900" />
              <span className="font-bold text-gray-900">{user.points || 0} Points</span>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  data-testid="user-menu-trigger"
                >
                  <Avatar className="h-10 w-10 border-2 border-[#3F51B5]">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#3F51B5] text-white font-semibold">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'S'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-[#333333]">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-[#009688] font-medium">{user.department || user.branch}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate('/student/profile')}
                  className="cursor-pointer"
                  data-testid="profile-menu-item"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                  data-testid="logout-menu-item"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t border-gray-100">
          <nav className="flex gap-1 px-8 py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${isActive
                    ? 'bg-[#3F51B5] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  data-testid={`desktop-nav-${item.name.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-1 bg-[#CDDC39] text-gray-900 text-xs px-2 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;