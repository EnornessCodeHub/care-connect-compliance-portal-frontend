import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LessonForm() {
  const { id, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = id ? parseInt(id) : 0;
  const chapterIdNum = chapterId ? parseInt(chapterId) : 0;
  const lessonIdNum = lessonId ? parseInt(lessonId) : 0;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lessonIdNum) {
      loadLesson();
    }
  }, [courseId, chapterIdNum, lessonIdNum]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const lessonsResponse = await courseService.getLessonsByChapter(courseId, chapterIdNum);
      if (lessonsResponse.success && lessonsResponse.data) {
        const lesson = lessonsResponse.data.find(ls => ls.id === lessonIdNum);
        if (lesson) {
          setTitle(lesson.title);
          setDescription(lesson.description || '');
          setOrder(lesson.order);
          setIsActive(lesson.is_active);
          setContent(lesson.content || '');
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load lesson"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Lesson title is required"
      });
      return;
    }

    try {
      setSaving(true);
      
      const lessonData = {
        title: title.trim(),
        description: description.trim() || undefined,
        order,
        is_active: isActive,
        content: content || undefined,
      };

      if (lessonIdNum) {
        const response = await courseService.updateLesson(courseId, chapterIdNum, lessonIdNum, lessonData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Lesson updated successfully"
          });
          navigate(`/course/${courseId}/chapters/${chapterIdNum}/lessons`);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update lesson"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading lesson...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Lesson</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/course/${courseId}/chapters/${chapterIdNum}/lessons`}>Cancel</Link>
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Lesson'
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Lesson Title *</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter Lesson Title"
              disabled={saving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Description</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Write Lesson Description"
              disabled={saving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Order</Label>
            <Input 
              type="number" 
              value={order} 
              onChange={e => setOrder(Number(e.target.value))}
              disabled={saving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Content</Label>
            <Textarea 
              className="min-h-[200px]" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="You can paste HTML or text content here"
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Is Active</Label>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} disabled={saving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
