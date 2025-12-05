import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6" data-testid="edit-event-page">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Card className="card p-8">
        <h1 className="text-2xl font-heading font-bold">Edit Event {id}</h1>
        <p className="text-gray-600 mt-2">Edit event functionality coming soon...</p>
      </Card>
    </div>
  );
};

export default EditEvent;