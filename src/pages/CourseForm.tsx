import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import staffService, { Staff } from '@/services/staffService';
import courseService from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [thumbnail, setThumbnail] = useState<string | undefined>(); // For upload (base64)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(); // From backend (URL)
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
      const response = await courseService.getCourseById(parseInt(id));
      if (response.success && response.data) {
        const course = response.data;
        setTitle(course.title);
        setDescription(course.description || '');
        setPublished(course.published);
        setCertificateEnabled(course.certificate_enabled);
        // Use thumbnail_url from GET response for display
        setThumbnailUrl(course.thumbnail_url);
        setAssignedStaffIds(course.assigned_staff_ids || []);
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

  const onSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Course title is required"
      });
      return;
    }

    try {
      setSaving(true);
      
      const courseData = {
        title: title.trim(),
        description: description.trim() || undefined,
        // Only send thumbnail if a new image was uploaded (base64 data URL)
        // Format: data:image/png;base64,iVBORw0KG...
        // If thumbnail is undefined, backend will keep existing image
        thumbnail: thumbnail || undefined,
        published,
        certificate_enabled: certificateEnabled,
        assigned_staff_ids: assignedStaffIds.length > 0 ? assignedStaffIds : undefined,
      };

      if (editing && id) {
        const response = await courseService.updateCourse(parseInt(id), courseData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Course updated successfully"
          });
          navigate('/course/manage');
        }
      } else {
        const response = await courseService.createCourse(courseData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Course created successfully"
          });
          navigate('/course/manage');
        }
      }
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
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{editing ? 'Edit Course' : 'Add Course'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/course/manage">Cancel</Link>
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Course'
            )}
          </Button>
        </div>
      </div>

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
              disabled={saving}
            />
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
            {assignedStaffIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignedStaffIds.map(id => {
                  const staff = staffList.find(s => s.id === id);
                  if (!staff) return null;
                  return (
                    <div key={id} className="px-3 py-1.5 bg-muted rounded-md text-sm flex items-center gap-2">
                      <span>{staff.fullname || staff.username}</span>
                      <button 
                        className="text-xs text-muted-foreground hover:text-destructive" 
                        onClick={() => toggleStaff(id)}
                        disabled={saving}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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

                  // Validate file type
                  if (!file.type.startsWith('image/')) {
                    toast({
                      variant: "destructive",
                      title: "Invalid File",
                      description: "Please select an image file.",
                    });
                    return;
                  }

                  // Validate file size (max 5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      variant: "destructive",
                      title: "File Too Large",
                      description: "Please select an image smaller than 5MB.",
                    });
                    return;
                  }

                  // Convert to base64 data URL format: data:image/png;base64,iVBORw0KG...
                  const reader = new FileReader();
                  reader.onload = () => {
                    // reader.result will be in format: data:image/png;base64,iVBORw0KG...
                    const base64DataUrl = reader.result as string;
                    setThumbnail(base64DataUrl); // Set for POST/PUT
                    setThumbnailUrl(undefined); // Clear old URL since we have new image
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
                      // Reset file input
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
    </div>
  );
}
