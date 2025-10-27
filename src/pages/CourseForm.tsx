import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Course, generateId, loadCourses, upsertCourse } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleStaffData } from '@/lib/sampleStaffData';

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const existing = useMemo(() => loadCourses().find(c => c.id === id), [id]);

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [published, setPublished] = useState(existing?.published ?? true);
  const [certificateEnabled, setCertificateEnabled] = useState(existing?.certificateEnabled ?? false);
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>(existing?.assignedStaffIds || []);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(existing?.thumbnailUrl);

  useEffect(() => {
    if (editing && !existing) navigate('/training/manage');
  }, [editing, existing, navigate]);

  const onSave = () => {
    const now = new Date().toISOString();
    const course: Course = {
      id: existing?.id || generateId('course'),
      title: title.trim() || 'Untitled course',
      description: description.trim(),
      thumbnailUrl,
      published,
      createdBy: existing?.createdBy || 'You',
      updatedAt: now,
      certificateEnabled,
      assignedStaffIds,
      chapters: existing?.chapters || [],
    };
    upsertCourse(course);
    navigate('/training/manage');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{editing ? 'Edit Course' : 'Add Course'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/training/manage">Cancel</Link>
          </Button>
          <Button onClick={onSave}>Save Course</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Course Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Course Title" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write Course Description" />
          </div>
          <div className="grid gap-2">
            <Label>Assign Staff Members</Label>
            <div className="flex flex-wrap gap-2">
              <Select onValueChange={(v) => setAssignedStaffIds(prev => prev.includes(v) ? prev : [...prev, v])}>
                <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select staff members" /></SelectTrigger>
                <SelectContent>
                  {sampleStaffData.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignedStaffIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {assignedStaffIds.map(id => {
                    const person = sampleStaffData.find(s => s.id === id);
                    return (
                      <div key={id} className="px-2 py-1 bg-muted rounded-md text-sm flex items-center gap-2">
                        <span>{person?.name || id}</span>
                        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setAssignedStaffIds(assignedStaffIds.filter(x => x !== id))}>Remove</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Upload Course Thumbnail</Label>
            <div className="border border-dashed rounded-md p-4 text-center">
              <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setThumbnailUrl(reader.result as string);
                reader.readAsDataURL(file);
              }} />
              {thumbnailUrl && (
                <div className="mt-4 flex justify-center">
                  <img src={thumbnailUrl} alt="thumbnail preview" className="max-h-40 rounded-md" />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Published</Label>
              <p className="text-sm text-muted-foreground">Control course visibility</p>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Enable Certificate for this Course</Label>
              <p className="text-sm text-muted-foreground">Issue certificate on completion</p>
            </div>
            <Switch checked={certificateEnabled} onCheckedChange={setCertificateEnabled} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


