import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@college.edu', branch: 'Computer Science', points: 48 },
    { id: 2, name: 'Jane Smith', email: 'jane@college.edu', branch: 'IT', points: 36 },
    { id: 3, name: 'Mike Johnson', email: 'mike@college.edu', branch: 'ECE', points: 52 },
  ];

  return (
    <div className="space-y-8" data-testid="user-management">
      <div>
        <h1 className="text-4xl font-heading font-bold text-[#333333]">User Management</h1>
        <p className="text-lg text-gray-600 mt-2">Manage student accounts and points</p>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="card" data-testid={`user-${user.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-[#3F51B5]">
                  <AvatarFallback className="bg-[#3F51B5] text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg text-[#333333]">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Badge variant="outline" className="border-[#009688] text-[#009688]">
                  {user.branch}
                </Badge>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#CDDC39] rounded-full">
                  <Trophy className="w-4 h-4 text-gray-900" />
                  <span className="font-bold text-gray-900">{user.points} pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;