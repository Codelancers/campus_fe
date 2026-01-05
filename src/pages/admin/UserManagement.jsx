import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Trash2, Search, Filter } from 'lucide-react';
import { getUsersByDepartment, deleteUser } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, [selectedDept]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersByDepartment(selectedDept);
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        toast.error("Failed to fetch users: Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.rollNo?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      // Remove from local state to avoid refetch
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  const departments = ['ALL', 'CSE', 'ECE', 'MEC', 'CE', 'EEE', 'CSE-ALLIED', 'OTHER'];

  return (
    <div className="space-y-8" data-testid="user-management">
      <div>
        <h1 className="text-4xl font-heading font-bold text-[#333333] dark:text-white">User Management</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Manage student accounts and points</p>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, email, or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-slate-950"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="h-11 bg-white dark:bg-slate-950">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Filter Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept === 'ALL' ? 'All Departments' : dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No users found.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="card hover:shadow-md transition-shadow" data-testid={`user-${user.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-[#3F51B5]">
                    <AvatarFallback className="bg-[#3F51B5] text-white font-semibold">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-lg text-[#333333] dark:text-white truncate">
                        {user.name}
                      </h3>
                      {user.year && (
                        <Badge variant="secondary" className="text-xs">
                          Year {user.year}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="truncate">{user.email}</span>
                      {user.phone && <span className="hidden sm:inline">•</span>}
                      {user.phone && <span>{user.phone}</span>}
                      {user.rollNo && <span className="hidden sm:inline">•</span>}
                      {user.rollNo && <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{user.rollNo}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-[#009688] text-[#009688] bg-[#009688]/10 whitespace-nowrap">
                        {user.department || 'General'}
                      </Badge>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border border-yellow-200 dark:border-yellow-700">
                        <Trophy className="w-3.5 h-3.5 text-yellow-700 dark:text-yellow-500" />
                        <span className="font-bold text-yellow-800 dark:text-yellow-400 text-sm whitespace-nowrap">
                          {user.points || 0} pts
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;