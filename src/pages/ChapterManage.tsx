import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadCourses, saveCourses, generateId } from '@/lib/utils';

export default function ChapterManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const courses = useMemo(() => loadCourses(), []);
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">Course not found.</Card>
      </div>
    );
  }

  const addChapter = () => {
    course.chapters.push({ id: generateId('chapter'), title: 'New Chapter', description: '', order: course.chapters.length + 1, isActive: true, lessons: [] });
    saveCourses(courses);
    navigate(0);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chapter Management</h1>
        <div className="flex gap-2">
          <Button onClick={addChapter}>Add Chapter</Button>
          <Button asChild variant="outline"><Link to={`/training/manage`}>Back to Courses</Link></Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chapter Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.chapters.map(ch => (
                <TableRow key={ch.id}>
                  <TableCell><Link to={`/training/${course.id}/chapters/${ch.id}/lessons`} className="text-primary hover:underline">{ch.title}</Link></TableCell>
                  <TableCell>{ch.description}</TableCell>
                  <TableCell>{ch.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{new Date(course.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" asChild variant="outline"><Link to={`/training/${course.id}/chapters/${ch.id}/edit`}>Edit</Link></Button>
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


