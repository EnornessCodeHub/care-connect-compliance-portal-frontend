import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TrainingLibrary = () => {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Course Library</h1>
        <Button asChild variant="outline">
          <Link to="/course/create">Add Course</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Browse courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingLibrary;