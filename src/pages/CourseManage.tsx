import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useNavigate } from 'react-router-dom';
import { loadCourses, deleteCourse } from '@/lib/utils';

export default function CourseManage() {
  const navigate = useNavigate();
  const courses = useMemo(() => loadCourses(), []);

  const handleDelete = (id: string) => {
    deleteCourse(id);
    navigate(0);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Course Management</h1>
        <Button asChild>
          <Link to="/training/create">Add Course</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link className="text-primary hover:underline" to={`/training/course/${c.id}`}>{c.title}</Link>
                  </TableCell>
                  <TableCell>{new Date(c.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{c.published ? 'Active' : 'Draft'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/training/edit/${c.id}`}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <p className="text-muted-foreground">No courses yet.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


