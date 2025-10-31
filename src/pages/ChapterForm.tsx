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

export default function ChapterForm() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = id ? parseInt(id) : 0;
  const chapterIdNum = chapterId ? parseInt(chapterId) : 0;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (chapterIdNum) {
      loadChapter();
    }
  }, [courseId, chapterIdNum]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      const chaptersResponse = await courseService.getChaptersByCourse(courseId);
      if (chaptersResponse.success && chaptersResponse.data) {
        const chapter = chaptersResponse.data.find(ch => ch.id === chapterIdNum);
        if (chapter) {
          setTitle(chapter.title);
          setDescription(chapter.description || '');
          setIsActive(chapter.is_active);
          setOrder(chapter.order);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load chapter"
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
        description: "Chapter title is required"
      });
      return;
    }

    try {
      setSaving(true);
      
      const chapterData = {
        title: title.trim(),
        description: description.trim() || undefined,
        order,
        is_active: isActive,
      };

      if (chapterIdNum) {
        const response = await courseService.updateChapter(courseId, chapterIdNum, chapterData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Chapter updated successfully"
          });
          navigate(`/course/${courseId}/chapters`);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update chapter"
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
          <span className="text-muted-foreground">Loading chapter...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Chapter</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/course/${courseId}/chapters`}>Cancel</Link>
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Chapter'
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Chapter Title *</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter Chapter Title"
              disabled={saving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Chapter Description</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Write Chapter Description"
              disabled={saving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Chapter Order</Label>
            <Input 
              type="number" 
              value={order} 
              onChange={e => setOrder(Number(e.target.value))}
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
