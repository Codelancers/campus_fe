import React from 'react';
import { Card } from '@/components/ui/card';

const CertificateManagement = () => {
  return (
    <div className="space-y-8" data-testid="certificate-management">
      <div>
        <h1 className="text-4xl font-heading font-bold text-[#333333]">Certificate Management</h1>
        <p className="text-lg text-gray-600 mt-2">Manage and send certificates to students</p>
      </div>
      <Card className="card p-8">
        <p className="text-gray-600">Certificate management functionality coming soon...</p>
      </Card>
    </div>
  );
};

export default CertificateManagement;