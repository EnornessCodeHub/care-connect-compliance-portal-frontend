import React from 'react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { loadCourses } from '@/lib/utils';

const Training = () => {
  const courses = useMemo(() => loadCourses(), []);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/training/manage">Manage Courses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/training/create">Add Course</Link>
          </Button>
        </div>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No courses yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="h-40 bg-muted flex items-center justify-center">
                {c.thumbnailUrl ? (
                  <img src={c.thumbnailUrl} alt={c.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-muted-foreground">No Thumbnail</span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div>
                  <Progress value={0} className="h-2" />
                  <div className="text-xs text-right text-muted-foreground mt-1">0%</div>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/training/course/${c.id}`}>Continue to course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;