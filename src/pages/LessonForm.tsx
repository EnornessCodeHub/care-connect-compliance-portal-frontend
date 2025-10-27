import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadCourses, saveCourses } from '@/lib/utils';

export default function LessonForm() {
  const { id, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const courses = useMemo(() => loadCourses(), []);
  const course = courses.find(c => c.id === id);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);
  const lesson = chapter?.lessons.find(ls => ls.id === lessonId);

  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [order, setOrder] = useState<number>(lesson?.order || 1);
  const [isActive, setIsActive] = useState(lesson?.isActive ?? true);
  const [content, setContent] = useState(lesson?.content || '');

  if (!course || !chapter || !lesson) return null;

  const onSave = () => {
    lesson.title = title;
    lesson.description = description;
    lesson.order = order;
    lesson.isActive = isActive;
    lesson.content = content;
    saveCourses(courses);
    navigate(`/training/${course.id}/chapters/${chapter.id}/lessons`);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Lesson</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to={`/training/${course.id}/chapters/${chapter.id}/lessons`}>Cancel</Link></Button>
          <Button onClick={onSave}>Save Lesson</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Lesson Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Lesson Title" />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write Lesson Description" />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Order</Label>
            <Input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label>Lesson Content</Label>
            <Textarea className="min-h-[200px]" value={content} onChange={e => setContent(e.target.value)} placeholder="You can paste HTML or text content here" />
          </div>
          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Is Active</Label>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


