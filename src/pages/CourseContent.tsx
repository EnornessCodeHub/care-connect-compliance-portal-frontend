import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, Link } from 'react-router-dom';
import { loadCourses } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CourseContent() {
  const { id } = useParams();
  const course = useMemo(() => loadCourses().find(c => c.id === id), [id]);

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">Course not found.</p>
          <div className="mt-4">
            <Button asChild variant="outline"><Link to="/training">Back to Courses</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-2">
        {course.chapters.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No content yet.</p>
            <div className="mt-4">
              <Button asChild><Link to={`/training/edit/${course.id}`}>Add Chapters and Lessons</Link></Button>
            </div>
          </Card>
        ) : (
          course.chapters
            .sort((a,b) => a.order - b.order)
            .map(ch => (
              <Card key={ch.id}>
                <div className="px-6 py-4 border-b font-medium">{ch.title}</div>
                <CardContent className="p-0">
                  {ch.lessons
                    .sort((a,b) => a.order - b.order)
                    .map(ls => (
                      <div key={ls.id} className="px-6 py-3 border-b last:border-0 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{ls.title}</div>
                          {ls.description && <div className="text-sm text-muted-foreground">{ls.description}</div>}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))
        )}
      </div>
      <div className="lg:col-span-1">
        <Card className="overflow-hidden">
          <div className="h-40 bg-muted flex items-center justify-center">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <span className="text-muted-foreground">No Thumbnail</span>
            )}
          </div>
          <div className="p-4 space-y-2">
            <div className="font-semibold">{course.title}</div>
            <div className="text-sm text-muted-foreground">{course.description}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}


