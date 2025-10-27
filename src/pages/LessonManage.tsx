import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadCourses, saveCourses, generateId } from '@/lib/utils';

export default function LessonManage() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const courses = useMemo(() => loadCourses(), []);
  const course = courses.find(c => c.id === id);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);

  if (!course || !chapter) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">Chapter not found.</Card>
      </div>
    );
  }

  const addLesson = () => {
    chapter.lessons.push({ id: generateId('lesson'), title: 'New Lesson', description: '', order: chapter.lessons.length + 1, isActive: true, content: '' });
    saveCourses(courses);
    navigate(0);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lesson Management</h1>
        <div className="flex gap-2">
          <Button onClick={addLesson}>Add Lesson</Button>
          <Button asChild variant="outline"><Link to={`/training/${course.id}/chapters`}>Back to Chapters</Link></Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{course.title} — {chapter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapter.lessons.map(ls => (
                <TableRow key={ls.id}>
                  <TableCell>{ls.title}</TableCell>
                  <TableCell>{ls.description}</TableCell>
                  <TableCell>{ls.order}</TableCell>
                  <TableCell>{ls.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button size="sm" asChild variant="outline"><Link to={`/training/${course.id}/chapters/${chapter.id}/lessons/${ls.id}/edit`}>Edit</Link></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


