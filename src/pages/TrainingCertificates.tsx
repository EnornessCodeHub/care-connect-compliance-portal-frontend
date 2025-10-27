import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrainingCertificates = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Certificates will appear here once courses are completed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingCertificates;