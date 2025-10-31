import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChapterManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = id ? parseInt(id) : 0;

  const [course, setCourse] = useState<courseService.Course | null>(null);
  const [chapters, setChapters] = useState<courseService.Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    if (courseId) {
      loadCourse();
      loadChapters();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoadingCourse(true);
      const response = await courseService.getCourseById(courseId);
      if (response.success && response.data) {
        setCourse(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load course"
      });
    } finally {
      setLoadingCourse(false);
    }
  };

  const loadChapters = async () => {
    try {
      setLoading(true);
      const response = await courseService.getChaptersByCourse(courseId);
      if (response.success && response.data) {
        setChapters(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load chapters"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Chapter title is required"
      });
      return;
    }

    try {
      const response = await courseService.createChapter(courseId, {
        title: newChapterTitle.trim(),
        order: chapters.length + 1,
        is_active: true
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Chapter created successfully"
        });
        setNewChapterTitle('');
        setAddDialogOpen(false);
        loadChapters();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create chapter"
      });
    }
  };

  if (loadingCourse) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading course...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">Course not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chapter Management</h1>
        <div className="flex gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Chapter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Chapter</DialogTitle>
                <DialogDescription>
                  Create a new chapter for this course
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Chapter Title *</Label>
                  <Input
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="Enter chapter title"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddChapter();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddChapter}>Create Chapter</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild variant="outline">
            <Link to="/course/manage">Back to Courses</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Loading chapters...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chapter Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chapters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No chapters yet. Add a chapter to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  chapters.map(ch => (
                    <TableRow key={ch.id}>
                      <TableCell>
                        <Link 
                          to={`/course/${courseId}/chapters/${ch.id}/lessons`} 
                          className="text-primary hover:underline"
                        >
                          {ch.title}
                        </Link>
                      </TableCell>
                      <TableCell>{ch.description || '-'}</TableCell>
                      <TableCell>{ch.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>{ch.lessons_count || 0}</TableCell>
                      <TableCell>{new Date(ch.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" asChild variant="outline">
                          <Link to={`/course/${courseId}/chapters/${ch.id}/edit`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
