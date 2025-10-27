import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadCourses, saveCourses } from '@/lib/utils';

export default function ChapterForm() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const courses = useMemo(() => loadCourses(), []);
  const course = courses.find(c => c.id === id);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);

  const [title, setTitle] = useState(chapter?.title || '');
  const [description, setDescription] = useState(chapter?.description || '');
  const [isActive, setIsActive] = useState(chapter?.isActive ?? true);
  const [order, setOrder] = useState<number>(chapter?.order || 1);

  if (!course || !chapter) return null;

  const onSave = () => {
    chapter.title = title;
    chapter.description = description;
    chapter.isActive = isActive;
    chapter.order = order;
    saveCourses(courses);
    navigate(`/training/${course.id}/chapters`);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Chapter</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to={`/training/${course.id}/chapters`}>Cancel</Link></Button>
          <Button onClick={onSave}>Save Chapter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Chapter Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Chapter Title" />
          </div>
          <div className="grid gap-2">
            <Label>Chapter Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write Chapter Description" />
          </div>
          <div className="grid gap-2">
            <Label>Chapter Order</Label>
            <Input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} />
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


