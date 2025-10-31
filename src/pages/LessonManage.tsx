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

export default function LessonManage() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = id ? parseInt(id) : 0;
  const chapterIdNum = chapterId ? parseInt(chapterId) : 0;

  const [course, setCourse] = useState<courseService.Course | null>(null);
  const [chapter, setChapter] = useState<courseService.Chapter | null>(null);
  const [lessons, setLessons] = useState<courseService.Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  useEffect(() => {
    if (courseId && chapterIdNum) {
      loadCourse();
      loadChapter();
      loadLessons();
    }
  }, [courseId, chapterIdNum]);

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

  const loadChapter = async () => {
    try {
      const response = await courseService.getChaptersByCourse(courseId);
      if (response.success && response.data) {
        const foundChapter = response.data.find(ch => ch.id === chapterIdNum);
        if (foundChapter) {
          setChapter(foundChapter);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load chapter"
      });
    }
  };

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await courseService.getLessonsByChapter(courseId, chapterIdNum);
      if (response.success && response.data) {
        setLessons(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load lessons"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Lesson title is required"
      });
      return;
    }

    try {
      const response = await courseService.createLesson(courseId, chapterIdNum, {
        title: newLessonTitle.trim(),
        order: lessons.length + 1,
        is_active: true
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Lesson created successfully"
        });
        setNewLessonTitle('');
        setAddDialogOpen(false);
        loadLessons();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create lesson"
      });
    }
  };

  if (loadingCourse) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!course || !chapter) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">Chapter not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lesson Management</h1>
        <div className="flex gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Lesson</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
                <DialogDescription>
                  Create a new lesson for this chapter
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Lesson Title *</Label>
                  <Input
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Enter lesson title"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddLesson();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLesson}>Create Lesson</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild variant="outline">
            <Link to={`/course/${courseId}/chapters`}>Back to Chapters</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{course.title} — {chapter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Loading lessons...</span>
            </div>
          ) : (
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
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No lessons yet. Add a lesson to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map(ls => (
                    <TableRow key={ls.id}>
                      <TableCell>{ls.title}</TableCell>
                      <TableCell>{ls.description || '-'}</TableCell>
                      <TableCell>{ls.order}</TableCell>
                      <TableCell>{ls.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <Button size="sm" asChild variant="outline">
                          <Link to={`/course/${courseId}/chapters/${chapterIdNum}/lessons/${ls.id}/edit`}>
                            Edit
                          </Link>
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
