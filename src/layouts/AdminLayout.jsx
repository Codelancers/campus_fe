import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  Bell,
  User,
  LogOut,
  Menu,
  Shield,
} from 'lucide-react';
import { getAdminData } from '@/lib/token';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get admin data from local storage
  const [admin] = useState(() => {
    const storedAdmin = getAdminData();
    return storedAdmin || {
      name: 'Admin User',
      email: 'admin@college.edu',
      role: 'Administrator',
      avatar: null,
    };
  });

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavigation = (href, mobile = false) => {
    if (mobile) setMobileMenuOpen(false);
    // Redirect all navigation except dashboard to under construction
    if (href !== '/admin') {
      navigate('/admin/under-construction');
    } else {
      navigate(href);
    }
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
            data-testid={`admin-nav-${item.name.toLowerCase()}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
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
                <Button variant="ghost" size="icon" data-testid="admin-mobile-menu-button">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b bg-gradient-to-r from-[#3F51B5] to-[#5C6BC0]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
                        <Shield className="w-6 h-6 text-[#3F51B5]" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-lg text-white">Campus Events</h2>
                        <p className="text-xs text-indigo-100">Admin Portal</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-4 space-y-1">
                    <NavItems mobile />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#3F51B5] to-[#5C6BC0] rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-xl text-[#333333]">
                  Campus Events
                </span>
                <p className="text-xs text-gray-500 -mt-1">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
              <Shield className="w-4 h-4 text-[#3F51B5]" />
              <span className="font-semibold text-sm text-[#3F51B5]">Admin</span>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  data-testid="admin-user-menu-trigger"
                >
                  <Avatar className="h-10 w-10 border-2 border-[#3F51B5]">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback className="bg-[#3F51B5] text-white font-semibold">
                      {admin.name ? admin.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-[#333333]">{admin.name}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                    <p className="text-xs text-[#3F51B5] font-medium">{admin.role || 'Administrator'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate('/admin/profile')}
                  className="cursor-pointer"
                  data-testid="admin-profile-menu-item"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                  data-testid="admin-logout-menu-item"
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
                  data-testid={`admin-desktop-nav-${item.name.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
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

export default AdminLayout;