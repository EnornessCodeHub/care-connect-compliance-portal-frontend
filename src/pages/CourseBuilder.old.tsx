import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Loader2, X, Plus, Trash2, GripVertical } from 'lucide-react';
import staffService, { Staff } from '@/services/staffService';
import courseService from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';

interface LessonFormData {
  id?: number; // For editing existing lessons
  title: string;
  description: string;
  content: string;
  order: number;
  is_active: boolean;
}

interface ChapterFormData {
  id?: number; // For editing existing chapters
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  lessons: LessonFormData[];
}

export default function CourseBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editing = Boolean(id);

  // Course Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();

  // Course Structure
  const [chapters, setChapters] = useState<ChapterFormData[]>([]);

  // UI State
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStaffList();
    if (editing && id) {
      loadCourse();
    }
  }, [id, editing]);

  const loadCourse = async () => {
    if (!id) return;
    
    try {
      setLoadingCourse(true);
      const courseResponse = await courseService.getCourseById(parseInt(id));
      if (courseResponse.success && courseResponse.data) {
        const course = courseResponse.data;
        setTitle(course.title);
        setDescription(course.description || '');
        setPublished(course.published);
        setCertificateEnabled(course.certificate_enabled);
        setThumbnailUrl(course.thumbnail_url);
        setAssignedStaffIds(course.assigned_staff_ids || []);

        // Load chapters with lessons
        const chaptersResponse = await courseService.getChaptersByCourse(parseInt(id));
        if (chaptersResponse.success && chaptersResponse.data) {
          const chaptersWithLessons = await Promise.all(
            chaptersResponse.data.map(async (chapter) => {
              const lessonsResponse = await courseService.getLessonsByChapter(parseInt(id), chapter.id);
              return {
                id: chapter.id,
                title: chapter.title,
                description: chapter.description || '',
                order: chapter.order,
                is_active: chapter.is_active,
                lessons: lessonsResponse.success && lessonsResponse.data
                  ? lessonsResponse.data.map(lesson => ({
                      id: lesson.id,
                      title: lesson.title,
                      description: lesson.description || '',
                      content: lesson.content || '',
                      order: lesson.order,
                      is_active: lesson.is_active,
                    }))
                  : []
              };
            })
          );
          setChapters(chaptersWithLessons);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load course"
      });
      navigate('/course/manage');
    } finally {
      setLoadingCourse(false);
    }
  };

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        setStaffList(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff list"
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  const toggleStaff = (staffId: number) => {
    setAssignedStaffIds(prev => prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]);
  };

  const getSelectedStaffLabel = () => {
    if (assignedStaffIds.length === 0) return 'Select staff members';
    if (assignedStaffIds.length === 1) {
      const staff = staffList.find(s => s.id === assignedStaffIds[0]);
      return staff?.fullname || staff?.username || '1 staff member';
    }
    return `${assignedStaffIds.length} staff members selected`;
  };

  // Chapter Management
  const addChapter = () => {
    const newChapter: ChapterFormData = {
      title: '',
      description: '',
      order: chapters.length + 1,
      is_active: true,
      lessons: []
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (index: number, updates: Partial<ChapterFormData>) => {
    setChapters(prev => prev.map((ch, i) => i === index ? { ...ch, ...updates } : ch));
  };

  const deleteChapter = (index: number) => {
    setChapters(prev => prev.filter((_, i) => i !== index).map((ch, i) => ({ ...ch, order: i + 1 })));
  };

  // Lesson Management
  const addLesson = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    const newLesson: LessonFormData = {
      title: '',
      description: '',
      content: '',
      order: chapter.lessons.length + 1,
      is_active: true
    };
    updateChapter(chapterIndex, {
      lessons: [...chapter.lessons, newLesson]
    });
  };

  const updateLesson = (chapterIndex: number, lessonIndex: number, updates: Partial<LessonFormData>) => {
    const chapter = chapters[chapterIndex];
    const updatedLessons = chapter.lessons.map((lesson, i) => 
      i === lessonIndex ? { ...lesson, ...updates } : lesson
    );
    updateChapter(chapterIndex, { lessons: updatedLessons });
  };

  const deleteLesson = (chapterIndex: number, lessonIndex: number) => {
    const chapter = chapters[chapterIndex];
    const updatedLessons = chapter.lessons.filter((_, i) => i !== lessonIndex)
      .map((lesson, i) => ({ ...lesson, order: i + 1 }));
    updateChapter(chapterIndex, { lessons: updatedLessons });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Course title is required"
      });
      return;
    }

    // Validate chapters
    for (const chapter of chapters) {
      if (!chapter.title.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "All chapters must have a title"
        });
        return;
      }

      // Validate lessons
      for (const lesson of chapter.lessons) {
        if (!lesson.title.trim()) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "All lessons must have a title"
          });
          return;
        }
      }
    }

    try {
      setSaving(true);

      // Step 1: Create or Update Course
      const courseData = {
        title: title.trim(),
        description: description.trim() || undefined,
        thumbnail: thumbnail || undefined,
        published,
        certificate_enabled: certificateEnabled,
        assigned_staff_ids: assignedStaffIds.length > 0 ? assignedStaffIds : undefined,
      };

      let courseId: number;
      if (editing && id) {
        const response = await courseService.updateCourse(parseInt(id), courseData);
        if (!response.success) throw new Error(response.message || 'Failed to update course');
        courseId = parseInt(id);
      } else {
        const response = await courseService.createCourse(courseData);
        if (!response.success) throw new Error(response.message || 'Failed to create course');
        courseId = response.data.id;
      }

      // Step 2: Save Chapters and Lessons
      for (const chapter of chapters) {
        let chapterId: number;
        
        if (chapter.id) {
          // Update existing chapter
          const response = await courseService.updateChapter(courseId, chapter.id, {
            title: chapter.title.trim(),
            description: chapter.description.trim() || undefined,
            order: chapter.order,
            is_active: chapter.is_active
          });
          if (!response.success) throw new Error('Failed to update chapter');
          chapterId = chapter.id;
        } else {
          // Create new chapter
          const response = await courseService.createChapter(courseId, {
            title: chapter.title.trim(),
            description: chapter.description.trim() || undefined,
            order: chapter.order,
            is_active: chapter.is_active
          });
          if (!response.success) throw new Error('Failed to create chapter');
          chapterId = response.data.id;
        }

        // Step 3: Save Lessons for this Chapter
        for (const lesson of chapter.lessons) {
          if (lesson.id) {
            // Update existing lesson
            await courseService.updateLesson(courseId, chapterId, lesson.id, {
              title: lesson.title.trim(),
              description: lesson.description.trim() || undefined,
              content: lesson.content.trim() || undefined,
              order: lesson.order,
              is_active: lesson.is_active
            });
          } else {
            // Create new lesson
            await courseService.createLesson(courseId, chapterId, {
              title: lesson.title.trim(),
              description: lesson.description.trim() || undefined,
              content: lesson.content.trim() || undefined,
              order: lesson.order,
              is_active: lesson.is_active
            });
          }
        }
      }

      toast({
        title: "Success",
        description: `Course ${editing ? 'updated' : 'created'} successfully`
      });
      navigate('/course/manage');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to ${editing ? 'update' : 'create'} course`
      });
    } finally {
      setSaving(false);
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

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{editing ? 'Edit Course' : 'Create Course'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={saving}>
            <Link to="/course/manage">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              editing ? 'Update Course' : 'Publish Course'
            )}
          </Button>
        </div>
      </div>

      {/* Step 1: Course Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Course Title *</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter Course Title"
              disabled={saving}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Write Course Description"
              rows={4}
              disabled={saving}
            />
          </div>

          <div className="grid gap-2">
            <Label>Upload Course Thumbnail</Label>
            <div className="border border-dashed rounded-md p-4 text-center">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith('image/')) {
                    toast({
                      variant: "destructive",
                      title: "Invalid File",
                      description: "Please select an image file.",
                    });
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      variant: "destructive",
                      title: "File Too Large",
                      description: "Please select an image smaller than 5MB.",
                    });
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64DataUrl = reader.result as string;
                    setThumbnail(base64DataUrl);
                    setThumbnailUrl(undefined);
                  };
                  reader.onerror = () => {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to read image file.",
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                disabled={saving}
              />
              {(thumbnail || thumbnailUrl) && (
                <div className="mt-4 flex justify-center flex-col items-center gap-2">
                  <img 
                    src={thumbnail || thumbnailUrl} 
                    alt="thumbnail preview" 
                    className="max-h-40 rounded-md" 
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setThumbnail(undefined);
                      setThumbnailUrl(undefined);
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    disabled={saving}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Assign Staff Members</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between w-full max-w-md" disabled={loadingStaff || saving}>
                  {loadingStaff ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading staff...
                    </>
                  ) : (
                    getSelectedStaffLabel()
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                {loadingStaff ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading staff...
                  </div>
                ) : staffList.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No staff members found
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-auto pr-1">
                      {staffList.map(staff => {
                        const active = assignedStaffIds.includes(staff.id);
                        return (
                          <button
                            key={staff.id}
                            type="button"
                            onClick={() => toggleStaff(staff.id)}
                            disabled={saving}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors',
                              active && 'bg-primary/10'
                            )}
                          >
                            <div className="font-medium">{staff.fullname || staff.username}</div>
                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                          </button>
                        );
                      })}
                    </div>
                    {assignedStaffIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                        {assignedStaffIds.map(id => {
                          const staff = staffList.find(s => s.id === id);
                          if (!staff) return null;
                          return (
                            <span key={id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                              {staff.fullname || staff.username}
                              <button 
                                className="hover:text-destructive" 
                                onClick={() => toggleStaff(id)}
                                disabled={saving}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Published</Label>
              <p className="text-sm text-muted-foreground">Control course visibility</p>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} disabled={saving} />
          </div>

          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Enable Certificate for this Course</Label>
              <p className="text-sm text-muted-foreground">Issue certificate on completion</p>
            </div>
            <Switch checked={certificateEnabled} onCheckedChange={setCertificateEnabled} disabled={saving} />
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Course Structure Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Structure</CardTitle>
            <Button onClick={addChapter} variant="outline" size="sm" disabled={saving}>
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {chapters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No chapters yet. Click "Add Chapter" to get started.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <AccordionItem 
                  key={chapterIndex} 
                  value={`chapter-${chapterIndex}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {chapter.title || `Chapter ${chapterIndex + 1}`}
                      </span>
                      {chapter.lessons.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'})
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* Chapter Details */}
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>Chapter Title *</Label>
                          <Input
                            value={chapter.title}
                            onChange={(e) => updateChapter(chapterIndex, { title: e.target.value })}
                            placeholder="e.g., Chapter 1: Introduction to NDIS"
                            disabled={saving}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Chapter Description</Label>
                          <Textarea
                            value={chapter.description}
                            onChange={(e) => updateChapter(chapterIndex, { description: e.target.value })}
                            placeholder="Chapter description (optional)"
                            rows={2}
                            disabled={saving}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={chapter.is_active}
                              onCheckedChange={(checked) => updateChapter(chapterIndex, { is_active: checked })}
                              disabled={saving}
                            />
                            <Label>Active</Label>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteChapter(chapterIndex)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Chapter
                          </Button>
                        </div>
                      </div>

                      {/* Lessons Section */}
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Lessons</Label>
                          <Button
                            onClick={() => addLesson(chapterIndex)}
                            variant="outline"
                            size="sm"
                            disabled={saving}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>

                        {chapter.lessons.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No lessons yet. Click "Add Lesson" to add content.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <Card key={lessonIndex} className="bg-muted/30">
                                <CardContent className="p-4 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">
                                        Lesson {lessonIndex + 1}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteLesson(chapterIndex, lessonIndex)}
                                      disabled={saving}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>

                                  <div className="grid gap-4">
                                    <div className="grid gap-2">
                                      <Label>Lesson Title *</Label>
                                      <Input
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(chapterIndex, lessonIndex, { title: e.target.value })}
                                        placeholder="Enter lesson title"
                                        disabled={saving}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Lesson Description</Label>
                                      <Textarea
                                        value={lesson.description}
                                        onChange={(e) => updateLesson(chapterIndex, lessonIndex, { description: e.target.value })}
                                        placeholder="Lesson description (optional)"
                                        rows={2}
                                        disabled={saving}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Lesson Content</Label>
                                      <Textarea
                                        value={lesson.content}
                                        onChange={(e) => updateLesson(chapterIndex, lessonIndex, { content: e.target.value })}
                                        placeholder="Enter lesson content (Video Link, Text, Document URL, etc.)"
                                        rows={6}
                                        disabled={saving}
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        You can add video links, embed images, or paste text content here.
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={lesson.is_active}
                                        onCheckedChange={(checked) => updateLesson(chapterIndex, lessonIndex, { is_active: checked })}
                                        disabled={saving}
                                      />
                                      <Label>Active</Label>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline" asChild disabled={saving}>
          <Link to="/course/manage">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            editing ? 'Update Course' : 'Publish Course'
          )}
        </Button>
      </div>
    </div>
  );
}


