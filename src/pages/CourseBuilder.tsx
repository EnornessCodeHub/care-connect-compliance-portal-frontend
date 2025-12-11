import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Loader2, 
  X, 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronUp,
  FileText,
  File,
  HelpCircle,
  Image as ImageIcon,
  Video,
  Upload,
  Save,
  Menu,
  Eye
} from 'lucide-react';
import courseService, { LessonType, QuizData, QuizQuestion } from '@/services/courseService';
import staffService, { Staff } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Custom styles for Quill editor
const quillStyles = `
  .quill-editor-wrapper {
    position: relative;
  }
  .ql-editor iframe {
    width: 100%;
    max-width: 560px;
    height: auto;
    aspect-ratio: 16 / 9;
    margin: 1rem 0;
  }
  .ql-editor img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    cursor: move;
    border: 2px dashed transparent;
    transition: border-color 0.2s;
    display: inline-block;
    position: relative;
  }
  .ql-editor img:hover {
    border-color: #3b82f6;
  }
  .ql-editor img[data-resizable="true"] {
    position: relative;
  }
  .ql-toolbar {
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }
  .ql-container {
    min-height: 300px;
  }
  .ql-editor {
    min-height: 300px;
  }
  @media (max-width: 640px) {
    .ql-toolbar .ql-formats {
      margin-bottom: 0.5rem;
    }
  }
`;

interface LessonFormData {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  order: number;
  is_active: boolean;
  lesson_type: LessonType;
  pdf_url?: string;
  pdf_file?: File;
  quiz_data?: QuizData;
  is_prerequisite?: boolean;
  is_free_preview?: boolean;
}

interface ChapterFormData {
  id?: number;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  lessons: LessonFormData[];
  isExpanded?: boolean;
}

export default function CourseBuilderNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editing = Boolean(id);
  const quillRef = useRef<Quill | null>(null);
  const quillContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Course Details
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(); // For upload (base64)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(); // From backend (URL)
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Course Structure
  const [chapters, setChapters] = useState<ChapterFormData[]>([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

  // Lesson Type Selection
  const [showLessonTypeDialog, setShowLessonTypeDialog] = useState(false);
  const [pendingChapterIndex, setPendingChapterIndex] = useState<number | null>(null);

  // UI State
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');

  useEffect(() => {
    loadStaffList();
    if (editing && id) {
      loadCourse();
    }
  }, [id, editing]);

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

  const loadCourse = async () => {
    if (!id) return;
    
    try {
      setLoadingCourse(true);
      const courseResponse = await courseService.getCourseById(parseInt(id));
      if (courseResponse.success && courseResponse.data) {
        const course = courseResponse.data;
        setCourseTitle(course.title);
        setCourseDescription(course.description || '');
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
                isExpanded: true,
                lessons: lessonsResponse.success && lessonsResponse.data
                  ? lessonsResponse.data.map(lesson => ({
                      id: lesson.id,
                      title: lesson.title,
                      description: lesson.description || '',
                      content: lesson.content || '',
                      order: lesson.order,
                      is_active: lesson.is_active,
                      lesson_type: lesson.lesson_type,
                      pdf_url: lesson.pdf_url,
                      quiz_data: lesson.quiz_data,
                      is_prerequisite: lesson.is_prerequisite,
                      lesson_type: (lesson.lesson_type || 'text') as LessonType,
                      pdf_url: lesson.pdf_url,
                      quiz_data: lesson.quiz_data,
                    }))
                  : []
              };
            })
          );
          setChapters(chaptersWithLessons);
          if (chaptersWithLessons.length > 0) {
            setSelectedChapterIndex(0);
          }
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

  // Chapter Management
  const addChapter = () => {
    const newChapter: ChapterFormData = {
      title: '',
      description: '',
      order: chapters.length + 1,
      is_active: true,
      lessons: [],
      isExpanded: true
    };
    const newIndex = chapters.length;
    setChapters([...chapters, newChapter]);
    setSelectedChapterIndex(newIndex);
    setSelectedLessonIndex(null);
  };

  const updateChapter = (index: number, updates: Partial<ChapterFormData>) => {
    setChapters(prev => prev.map((ch, i) => i === index ? { ...ch, ...updates } : ch));
  };

  const deleteChapter = (index: number) => {
    setChapters(prev => prev.filter((_, i) => i !== index).map((ch, i) => ({ ...ch, order: i + 1 })));
    if (selectedChapterIndex === index) {
      setSelectedChapterIndex(null);
      setSelectedLessonIndex(null);
    } else if (selectedChapterIndex !== null && selectedChapterIndex > index) {
      setSelectedChapterIndex(selectedChapterIndex - 1);
    }
  };

  const toggleChapterExpanded = (index: number) => {
    updateChapter(index, { isExpanded: !chapters[index].isExpanded });
  };

  // Lesson Management
  const openLessonTypeDialog = (chapterIndex: number) => {
    setPendingChapterIndex(chapterIndex);
    setShowLessonTypeDialog(true);
  };

  const addLesson = (type: LessonType) => {
    if (pendingChapterIndex === null) return;
    
    const chapter = chapters[pendingChapterIndex];
    const newLesson: LessonFormData = {
      title: '',
      description: '',
      content: '',
      order: chapter.lessons.length + 1,
      is_active: true,
      lesson_type: type,
      is_prerequisite: false,
      is_free_preview: false,
    };

    if (type === 'quiz') {
      newLesson.quiz_data = {
        questions: [],
        passing_score: 70
      };
    }

    updateChapter(pendingChapterIndex, {
      lessons: [...chapter.lessons, newLesson]
    });

    setSelectedChapterIndex(pendingChapterIndex);
    setSelectedLessonIndex(chapter.lessons.length);
    setShowLessonTypeDialog(false);
    setPendingChapterIndex(null);
  };

  const updateLesson = React.useCallback((chapterIndex: number, lessonIndex: number, updates: Partial<LessonFormData>) => {
    setChapters(prev => {
      const newChapters = [...prev];
      const chapter = newChapters[chapterIndex];
      if (chapter) {
        const newLessons = [...chapter.lessons];
        newLessons[lessonIndex] = { ...newLessons[lessonIndex], ...updates };
        newChapters[chapterIndex] = { ...chapter, lessons: newLessons };
      }
      return newChapters;
    });
  }, []);

  const deleteLesson = (chapterIndex: number, lessonIndex: number) => {
    const chapter = chapters[chapterIndex];
    const updatedLessons = chapter.lessons.filter((_, i) => i !== lessonIndex)
      .map((lesson, i) => ({ ...lesson, order: i + 1 }));
    updateChapter(chapterIndex, { lessons: updatedLessons });
    
    if (selectedLessonIndex === lessonIndex) {
      setSelectedLessonIndex(null);
    } else if (selectedLessonIndex !== null && selectedLessonIndex > lessonIndex) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
    }
  };

  const handleSave = async () => {
    if (!courseTitle.trim()) {
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
        title: courseTitle.trim(),
        description: courseDescription.trim() || undefined,
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
          const response = await courseService.updateChapter(courseId, chapter.id, {
            title: chapter.title.trim(),
            description: chapter.description.trim() || undefined,
            order: chapter.order,
            is_active: chapter.is_active
          });
          if (!response.success) throw new Error('Failed to update chapter');
          chapterId = chapter.id;
        } else {
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
          const lessonData: any = {
            title: lesson.title.trim(),
            description: lesson.description?.trim() || undefined,
            order: lesson.order,
            is_active: lesson.is_active,
            lesson_type: lesson.lesson_type,
          };

          if (lesson.lesson_type === 'text') {
            lessonData.content = lesson.content || undefined;
          } else if (lesson.lesson_type === 'pdf') {
            // Handle PDF file upload - convert to base64 if file exists
            if (lesson.pdf_file) {
              try {
                // Convert PDF file to base64
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                  reader.onload = () => {
                    const base64 = reader.result as string;
                    resolve(base64);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(lesson.pdf_file!);
                });
                
                const pdfBase64 = await base64Promise;
                // Send base64 to backend - backend will handle file upload and return URL
                lessonData.pdf = pdfBase64;
              } catch (error) {
                console.error('Error converting PDF to base64:', error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to process PDF file"
                });
                throw error;
              }
            } else {
              // Use existing PDF URL if no new file
              lessonData.pdf_url = lesson.pdf_url || undefined;
            }
          } else if (lesson.lesson_type === 'quiz') {
            lessonData.quiz_data = lesson.quiz_data;
          }

          if (lesson.id) {
            await courseService.updateLesson(courseId, chapterId, lesson.id, lessonData);
          } else {
            await courseService.createLesson(courseId, chapterId, lessonData);
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

  // Memoize selectedLesson to prevent unnecessary re-renders when only content changes
  // MUST be before any early returns to follow Rules of Hooks
  const selectedLesson = useMemo(() => {
    if (selectedChapterIndex !== null && selectedLessonIndex !== null) {
      const lesson = chapters[selectedChapterIndex]?.lessons[selectedLessonIndex];
      return lesson || null;
    }
    return null;
  }, [
    chapters, 
    selectedChapterIndex, 
    selectedLessonIndex,
    // Only re-compute when lesson ID, title, or type changes, not content
    chapters[selectedChapterIndex || -1]?.lessons[selectedLessonIndex || -1]?.id,
    chapters[selectedChapterIndex || -1]?.lessons[selectedLessonIndex || -1]?.title,
    chapters[selectedChapterIndex || -1]?.lessons[selectedLessonIndex || -1]?.lesson_type
  ]);

  const selectedChapter = selectedChapterIndex !== null ? chapters[selectedChapterIndex] : null;

  if (loadingCourse) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
        <span className="text-muted-foreground">Loading course...</span>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
            {chapters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Add a first chapter to start building your course.</p>
                <p className="text-sm">You're off to a great start!</p>
              </div>
            ) : (
              chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                      selectedChapterIndex === chapterIndex && "bg-muted"
                    )}
                    onClick={() => {
                      setSelectedChapterIndex(chapterIndex);
                      setSelectedLessonIndex(null);
                  if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChapterExpanded(chapterIndex);
                      }}
                      className="flex-1 text-left flex items-center gap-2"
                    >
                      <ChevronUp
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          !chapter.isExpanded && "rotate-180"
                        )}
                      />
                      <span className="font-medium text-sm">
                        {chapter.title || `Chapter ${chapterIndex + 1}`}
                      </span>
                    </button>
                  </div>
                  
                  {chapter.isExpanded && (
                    <div className="ml-6 space-y-1">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lessonIndex}
                          onClick={() => {
                            setSelectedChapterIndex(chapterIndex);
                            setSelectedLessonIndex(lessonIndex);
                        if (isMobile) setSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                            selectedChapterIndex === chapterIndex && selectedLessonIndex === lessonIndex
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {lesson.lesson_type === 'text' && <FileText className="h-4 w-4" />}
                          {lesson.lesson_type === 'pdf' && <File className="h-4 w-4" />}
                          {lesson.lesson_type === 'quiz' && <HelpCircle className="h-4 w-4" />}
                          <span className="truncate">{lesson.title || `Lesson ${lessonIndex + 1}`}</span>
                        </button>
                      ))}
                      <button
                    onClick={() => {
                      openLessonTypeDialog(chapterIndex);
                      if (isMobile) setSidebarOpen(false);
                    }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add lesson
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t space-y-2">
            <Button
              onClick={addChapter}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={saving}
            >
              <Plus className="h-4 w-4 mr-2" />
              Chapter
            </Button>
      </div>
    </div>
  );

  return (
    <>
      <style>{quillStyles}</style>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-4 w-4" />
            </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
              )}
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/course/manage">
                  <X className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold truncate">{courseTitle || 'New Course'}</h1>
                {!published && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-muted rounded-full flex-shrink-0">Draft</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {id ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  asChild
                >
                  <a
                    href={`/course/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </a>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  disabled
                  title="Save course first to preview"
                >
                  Preview
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving} size="sm">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="container mx-auto px-2 sm:px-4 border-t overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-9 sm:h-10 w-full sm:w-auto overflow-y-hidden">
                <TabsTrigger value="curriculum" className="flex-1 sm:flex-initial">Curriculum</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 sm:flex-initial">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum" className="mt-0"></TabsContent>
              <TabsContent value="settings" className="mt-0">
                <div className="container mx-auto px-2 sm:px-6 py-4">
                  <CourseSettings
                    title={courseTitle}
                    description={courseDescription}
                    published={published}
                    certificateEnabled={certificateEnabled}
                    thumbnail={thumbnail}
                    thumbnailUrl={thumbnailUrl}
                    assignedStaffIds={assignedStaffIds}
                    staffList={staffList}
                    loadingStaff={loadingStaff}
                    onTitleChange={setCourseTitle}
                    onDescriptionChange={setCourseDescription}
                    onPublishedChange={setPublished}
                    onCertificateEnabledChange={setCertificateEnabled}
                    onThumbnailChange={setThumbnail}
                    onThumbnailUrlChange={setThumbnailUrl}
                    onAssignedStaffIdsChange={setAssignedStaffIds}
                    disabled={saving}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {activeTab === 'curriculum' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Course Structure */}
            {!isMobile && (
              <div className="w-80 border-r bg-muted/30 overflow-y-auto hidden lg:block">
                <SidebarContent />
              </div>
            )}
        {/* Right Panel - Editor */}
        <div className="flex-1 overflow-y-auto bg-background">
      {selectedChapter && selectedLesson ? (
        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
          <LessonEditor
            key={selectedLesson.id ?? `${selectedChapterIndex}-${selectedLessonIndex}`}
            lesson={selectedLesson}
            chapterIndex={selectedChapterIndex!}
            lessonIndex={selectedLessonIndex!}
            onUpdate={(updates) =>
              updateLesson(selectedChapterIndex!, selectedLessonIndex!, updates)
            }
            quillRef={quillRef}
            quillContainerRef={quillContainerRef}
          />
        </div>
          ) : selectedChapter ? (
                <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
              <ChapterEditor
                chapter={selectedChapter}
                chapterIndex={selectedChapterIndex!}
                onUpdate={(updates) => updateChapter(selectedChapterIndex!, updates)}
                onDelete={() => deleteChapter(selectedChapterIndex!)}
                onAddLesson={() => openLessonTypeDialog(selectedChapterIndex!)}
                disabled={saving}
              />
            </div>
          ) : chapters.length === 0 ? (
                <div className="flex items-center justify-center h-full px-4">
                  <div className="text-center space-y-4 max-w-md">
                    <p className="text-base sm:text-lg text-muted-foreground">
                  Add a first chapter to start building your course.
                </p>
                <p className="text-sm text-muted-foreground">
                  You're off to a great start!
                </p>
                    <Button onClick={addChapter} size="lg" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add chapter
                </Button>
              </div>
            </div>
          ) : (
                <div className="flex items-center justify-center h-full px-4">
                  <p className="text-muted-foreground text-center">Select a chapter or lesson to edit</p>
            </div>
          )}
        </div>
      </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto bg-background">
            {/* Settings content is already in TabsContent above */}
          </div>
        )}

      {/* Lesson Type Selection Dialog */}
      <Dialog open={showLessonTypeDialog} onOpenChange={setShowLessonTypeDialog}>
        <DialogContent className="max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle>Lessons</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            <button
              onClick={() => addLesson('text')}
              className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-muted hover:border-primary transition-colors"
            >
              <FileText className="h-12 w-12 text-primary" />
              <span className="font-medium">Text</span>
            </button>
            <button
              onClick={() => addLesson('pdf')}
              className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-muted hover:border-primary transition-colors"
            >
              <File className="h-12 w-12 text-primary" />
              <span className="font-medium">PDF</span>
            </button>
            <button
              onClick={() => addLesson('quiz')}
              className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-muted hover:border-primary transition-colors"
            >
              <HelpCircle className="h-12 w-12 text-primary" />
              <span className="font-medium">Quiz</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

// Chapter Editor Component
interface ChapterEditorProps {
  chapter: ChapterFormData;
  chapterIndex: number;
  onUpdate: (updates: Partial<ChapterFormData>) => void;
  onDelete: () => void;
  onAddLesson: () => void;
  disabled: boolean;
}

function ChapterEditor({ chapter, onUpdate, onDelete, onAddLesson, disabled }: ChapterEditorProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">Edit {chapter.title || 'Chapter'}</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Chapter title *</Label>
            <Input
              value={chapter.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter a chapter title"
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Chapter Description</Label>
            <Textarea
              value={chapter.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Chapter description (optional)"
              rows={3}
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={onAddLesson} variant="outline" disabled={disabled} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
            <Button onClick={onDelete} variant="destructive" disabled={disabled} className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Lesson Editor Component
interface LessonEditorProps {
  lesson: LessonFormData;
  chapterIndex: number;
  lessonIndex: number;
  onUpdate: (updates: Partial<LessonFormData>) => void;
  quillRef: React.RefObject<Quill | null>;
  quillContainerRef: React.RefObject<HTMLDivElement>;
}

const LessonEditor = React.memo(function LessonEditor({ lesson, onUpdate, quillRef, quillContainerRef }: LessonEditorProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(lesson.content || '');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Use local container ref to avoid conflicts
  const localQuillContainerRef = useRef<HTMLDivElement>(null);

  // Define handlers before using them in Quill initialization
  const handleImageUpload = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select an image smaller than 5MB."
        });
        return;
      }

      // Convert to base64 and insert image with resize capability
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const quill = quillRef.current;
        if (quill) {
          try {
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            
            // Insert image as blob
            quill.insertEmbed(index, 'image', base64);
            
            // Add resize functionality after image is inserted
            setTimeout(() => {
              const editor = quill.root;
              const images = editor.querySelectorAll('img.ql-image-resizable, img[src^="data:"]');
              images.forEach((imgEl: HTMLImageElement) => {
                if (!imgEl.dataset.resizable) {
                  imgEl.dataset.resizable = 'true';
                  makeImageResizable(imgEl, quill);
                }
              });
            }, 100);
            
            quill.setSelection(index + 1);
          } catch (error) {
            console.error('Error inserting image:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to insert image."
            });
          }
        }
      };
      reader.readAsDataURL(file);
    };
  }, [toast]);

  const handleVideoLink = React.useCallback(() => {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (url && url.trim()) {
      const quill = quillRef.current;
      if (quill) {
        try {
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          
          // Try to detect YouTube or Vimeo URLs and embed them
          let embedUrl = '';
          const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
          const vimeoRegex = /vimeo\.com\/(\d+)/;
          
          const youtubeMatch = url.match(youtubeRegex);
          const vimeoMatch = url.match(vimeoRegex);
          
          if (youtubeMatch) {
            embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
          } else if (vimeoMatch) {
            embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
          }
          
          if (embedUrl) {
            // Insert as iframe embed
            const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            quill.clipboard.dangerouslyPasteHTML(index, iframe);
            quill.setSelection(index + 1);
          } else {
            // Insert as clickable link
            quill.insertText(index, url, 'link', url);
            quill.setSelection(index + url.length);
          }
        } catch (error) {
          // Fallback if selection fails
          const length = quill.getLength();
          quill.insertText(length - 1, url, 'link', url);
        }
      }
    }
  }, []);

  // Function to make images resizable with visual handles
  const makeImageResizable = React.useCallback((img: HTMLImageElement, quill: Quill) => {
    img.style.cursor = 'move';
    img.style.position = 'relative';
    img.style.display = 'inline-block';
    
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let aspectRatio = img.offsetWidth / img.offsetHeight;

    // Create resize handle
    const createResizeHandle = () => {
      const handle = document.createElement('div');
      handle.style.position = 'absolute';
      handle.style.bottom = '0';
      handle.style.right = '0';
      handle.style.width = '16px';
      handle.style.height = '16px';
      handle.style.backgroundColor = '#3b82f6';
      handle.style.border = '2px solid white';
      handle.style.borderRadius = '50%';
      handle.style.cursor = 'nwse-resize';
      handle.style.zIndex = '1000';
      handle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      return handle;
    };

    const resizeHandle = createResizeHandle();
    // Append handle to quill editor container for proper positioning
    quill.root.parentElement?.appendChild(resizeHandle);

    const updateHandlePosition = () => {
      const rect = img.getBoundingClientRect();
      const editorRect = quill.root.getBoundingClientRect();
      if (editorRect) {
        resizeHandle.style.left = (rect.right - editorRect.left - 16) + 'px';
        resizeHandle.style.top = (rect.bottom - editorRect.top - 16) + 'px';
      }
    };

    updateHandlePosition();

    const handleMouseDown = (e: MouseEvent) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = img.offsetWidth;
      startHeight = img.offsetHeight;
      aspectRatio = startWidth / startHeight;
      img.style.cursor = 'nwse-resize';
      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX);
        const newHeight = newWidth / aspectRatio;
        
        img.style.width = newWidth + 'px';
        img.style.height = newHeight + 'px';
        img.style.maxWidth = 'none';
        updateHandlePosition();
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        img.style.cursor = 'move';
      }
    };

    resizeHandle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Update handle position on image load/resize
    img.addEventListener('load', updateHandlePosition);
    
    // Add tooltip
    img.title = 'Click and drag the blue handle to resize';
    resizeHandle.title = 'Drag to resize image';
  }, []);

  // Initialize Quill editor - only for text lessons
  useEffect(() => {
    // Only initialize for text lessons
    if (lesson.lesson_type !== 'text') {
      // Clean up if switching away from text
      if (quillRef.current) {
        try {
          quillRef.current.off('text-change');
        } catch (e) {}
        quillRef.current = null;
      }
      return;
    }

    const container = localQuillContainerRef.current || quillContainerRef.current;
    if (!container) return;

    // CRITICAL: Destroy existing Quill completely before creating new one
    if (quillRef.current) {
      try {
        quillRef.current.off('text-change');
      } catch (e) {}
      quillRef.current = null;
    }

    // Remove any leftover Quill DOM (toolbars, containers) from previous mounts
    const wrapper = container.parentElement;
    if (wrapper) {
      wrapper.querySelectorAll('.ql-toolbar').forEach((el) => el.remove());
      wrapper.querySelectorAll('.ql-container').forEach((el) => el.remove());
    }

    // Clear container completely
    container.innerHTML = '';

    // Create new Quill instance
    const quill = new Quill(container, {
      theme: 'snow',
      placeholder: 'Your content here...',
      modules: {
        toolbar: {
          container: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
          ],
          handlers: {
            image: handleImageUpload,
            video: handleVideoLink,
          }
        },
        clipboard: {
          matchVisual: false
        },
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        }
      },
      formats: [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'color', 'background', 'align',
        'link', 'image', 'video', 'blockquote', 'code-block'
      ]
    });

    quillRef.current = quill;

    // Set initial content
    if (lesson.content) {
      quill.root.innerHTML = lesson.content;
    }

    // Update local state
    setContent(lesson.content || '');

    // Handle text changes
    const textChangeHandler = () => {
      const html = quill.root.innerHTML;
      setContent(html);
      
      // Debounce parent update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        onUpdate({ content: html });
      }, 5000);
    };

    quill.on('text-change', textChangeHandler);

    // Setup image resize handlers after content loads
    setTimeout(() => {
      const editor = quill.root;
      const images = editor.querySelectorAll('img');
      images.forEach((img: HTMLImageElement) => {
        if (!img.dataset.resizable) {
          img.dataset.resizable = 'true';
          makeImageResizable(img, quill);
        }
      });
    }, 300);

    return () => {
      if (quillRef.current) {
        try {
          quillRef.current.off('text-change');
        } catch (e) {}
        quillRef.current = null;
      }
    };
  }, [lesson.id, lesson.lesson_type]); // Re-run when lesson ID or type changes

  // Update parent on blur (when user leaves editor) - this is the main save point
  const handleBlur = React.useCallback(() => {
    if (!quillRef.current) return;
    
    // Cancel any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    // Immediately save content when user leaves editor
    const html = quillRef.current.root.innerHTML;
    setContent(html);
    onUpdate({ content: html });
  }, [onUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Render based on lesson type
  if (lesson.lesson_type === 'text') {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <span className="text-xs font-medium text-primary mb-2 block">Text</span>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">{lesson.title || 'New Lesson'}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={lesson.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter a lesson title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <div 
                className="border rounded-md bg-white quill-editor-wrapper"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onBlur={handleBlur}
              >
                <div 
                  key={`quill-${lesson.id || 'new'}`}
                  ref={(el) => {
                    localQuillContainerRef.current = el;
                    if (quillContainerRef) {
                      (quillContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                    }
                  }}
                  style={{ minHeight: '300px' }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Click image toolbar button to upload, then drag the blue handle to resize images
              </p>
            </div>

            <LessonSettings lesson={lesson} onUpdate={onUpdate} />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                // Discard changes - reset to original
                setContent(lesson.content || '');
              }} className="w-full sm:w-auto">
                Discard changes
              </Button>
              <Button onClick={() => {
                // Save is handled by parent component
                toast({
                  title: "Lesson saved",
                  description: "Your changes have been saved."
                });
              }} className="w-full sm:w-auto">
                Save lesson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lesson.lesson_type === 'pdf') {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please select a PDF file."
          });
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "File Too Large",
            description: "Please select a PDF smaller than 50MB."
          });
          return;
        }
        setPdfFile(file);
        onUpdate({ pdf_file: file });
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        setPdfFile(file);
        onUpdate({ pdf_file: file });
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    return (
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <span className="text-xs font-medium text-primary mb-2 block">PDF</span>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">{lesson.title || 'New Lesson'}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={lesson.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter a lesson title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>PDF File</Label>
              <div
                className="border-2 border-dashed rounded-md p-4 sm:p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2 break-words">
                  Drop PDF file here or click to upload
                </p>
                {pdfFile && (
                  <p className="text-sm text-primary font-medium mt-2 break-words">
                    Selected: {pdfFile.name}
                  </p>
                )}
                {lesson.pdf_url && !pdfFile && (() => {
                  // Construct full PDF URL
                  const getPdfUrl = (pdfUrl: string): string => {
                    // If already a full URL, return as is
                    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
                      return pdfUrl;
                    }
                    
                    // Get base URL from environment and remove /api/v1
                    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/v1';
                    const serverBase = baseUrl.replace('/api/v1', '');
                    
                    // If pdfUrl starts with /course_pdfs/, use it directly
                    if (pdfUrl.startsWith('/course_pdfs/')) {
                      return `${serverBase}${pdfUrl}`;
                    }
                    
                    // Otherwise, assume it's just the filename
                    return `${serverBase}/course_pdfs/${pdfUrl}`;
                  };
                  
                  const fullPdfUrl = getPdfUrl(lesson.pdf_url);
                  
                  return (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground break-words truncate">
                        Current PDF: {lesson.pdf_url}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <a
                          href={fullPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Current PDF
                        </a>
                      </Button>
                    </div>
                  );
                })()}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            <LessonSettings lesson={lesson} onUpdate={onUpdate} />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setPdfFile(null);
              }} className="w-full sm:w-auto">
                Discard changes
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Lesson saved",
                  description: "Your changes have been saved."
                });
              }} className="w-full sm:w-auto">
                Save lesson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lesson.lesson_type === 'quiz') {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <span className="text-xs font-medium text-primary mb-2 block">Quiz</span>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">{lesson.title || 'New Lesson'}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={lesson.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter a lesson title"
                className="w-full"
              />
            </div>

            <QuizEditor
              quizData={lesson.quiz_data}
              onUpdate={(quizData) => onUpdate({ quiz_data: quizData })}
            />

            <LessonSettings lesson={lesson} onUpdate={onUpdate} />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" className="w-full sm:w-auto">
                Discard changes
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Lesson saved",
                  description: "Your changes have been saved."
                });
              }} className="w-full sm:w-auto">
                Save lesson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders when only content changes
  // Return true if props are the same (don't re-render)
  // Return false if props are different (should re-render)
  const isSame = 
    prevProps.lesson.id === nextProps.lesson.id &&
    prevProps.lesson.lesson_type === nextProps.lesson.lesson_type &&
    prevProps.lesson.title === nextProps.lesson.title &&
    prevProps.lesson.is_prerequisite === nextProps.lesson.is_prerequisite &&
    prevProps.chapterIndex === nextProps.chapterIndex &&
    prevProps.lessonIndex === nextProps.lessonIndex;
  
  // React.memo: return true to skip re-render, false to re-render
  return isSame;
});

// Course Settings Component
interface CourseSettingsProps {
  title: string;
  description: string;
  published: boolean;
  certificateEnabled: boolean;
  thumbnail?: string;
  thumbnailUrl?: string;
  assignedStaffIds: number[];
  staffList: Staff[];
  loadingStaff: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPublishedChange: (value: boolean) => void;
  onCertificateEnabledChange: (value: boolean) => void;
  onThumbnailChange: (value: string | undefined) => void;
  onThumbnailUrlChange: (value: string | undefined) => void;
  onAssignedStaffIdsChange: (value: number[]) => void;
  disabled: boolean;
}

function CourseSettings({
  title,
  description,
  published,
  certificateEnabled,
  thumbnail,
  thumbnailUrl,
  assignedStaffIds,
  staffList,
  loadingStaff,
  onTitleChange,
  onDescriptionChange,
  onPublishedChange,
  onCertificateEnabledChange,
  onThumbnailChange,
  onThumbnailUrlChange,
  onAssignedStaffIdsChange,
  disabled
}: CourseSettingsProps) {
  const { toast } = useToast();

  const toggleStaff = (staffId: number) => {
    onAssignedStaffIdsChange(
      assignedStaffIds.includes(staffId)
        ? assignedStaffIds.filter(id => id !== staffId)
        : [...assignedStaffIds, staffId]
    );
  };

  const getSelectedStaffLabel = () => {
    if (assignedStaffIds.length === 0) return 'Select staff members';
    if (assignedStaffIds.length === 1) {
      const staff = staffList.find(s => s.id === assignedStaffIds[0]);
      return staff?.fullname || staff?.username || '1 staff member';
    }
    return `${assignedStaffIds.length} staff members selected`;
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Course Settings</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Course Title *</Label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter course title"
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Course Description</Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Enter course description"
              rows={4}
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="block">Assign Staff Members</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between w-full sm:max-w-md" disabled={loadingStaff || disabled}>
                  {loadingStaff ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="hidden sm:inline">Loading staff...</span>
                      <span className="sm:hidden">Loading...</span>
                    </>
                  ) : (
                    <span className="truncate">{getSelectedStaffLabel()}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[calc(100vw-2rem)] sm:w-80">
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
                            disabled={disabled}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors',
                              active && 'bg-primary/10'
                            )}
                          >
                            <div className="font-medium truncate">{staff.fullname || staff.username}</div>
                            <div className="text-xs text-muted-foreground truncate">{staff.email}</div>
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
                            <span key={id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs max-w-full">
                              <span className="truncate">{staff.fullname || staff.username}</span>
                              <button 
                                className="hover:text-destructive flex-shrink-0" 
                                onClick={() => toggleStaff(id)}
                                disabled={disabled}
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
                    <div key={id} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-muted rounded-md text-xs sm:text-sm flex items-center gap-1 sm:gap-2 max-w-full">
                      <span className="truncate">{staff.fullname || staff.username}</span>
                      <button 
                        className="text-xs text-muted-foreground hover:text-destructive flex-shrink-0" 
                        onClick={() => toggleStaff(id)}
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
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
                    const base64DataUrl = reader.result as string;
                    onThumbnailChange(base64DataUrl);
                    onThumbnailUrlChange(undefined);
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
                disabled={disabled}
                className="w-full"
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
                      onThumbnailChange(undefined);
                      onThumbnailUrlChange(undefined);
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    disabled={disabled}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-md p-3 gap-2">
            <div>
              <Label>Published</Label>
              <p className="text-sm text-muted-foreground">Make course visible to students</p>
            </div>
            <Switch
              checked={published}
              onCheckedChange={onPublishedChange}
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-md p-3 gap-2">
            <div>
              <Label>Enable Certificate</Label>
              <p className="text-sm text-muted-foreground">Issue certificate on completion</p>
            </div>
            <Switch
              checked={certificateEnabled}
              onCheckedChange={onCertificateEnabledChange}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Lesson Settings Component
interface LessonSettingsProps {
  lesson: LessonFormData;
  onUpdate: (updates: Partial<LessonFormData>) => void;
}

function LessonSettings({ lesson, onUpdate }: LessonSettingsProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Lesson settings</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>Make this a prerequisite</Label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Switch
            checked={lesson.is_prerequisite || false}
            onCheckedChange={(checked) => onUpdate({ is_prerequisite: checked })}
          />
        </div>
      </div>
    </div>
  );
}

// Quiz Editor Component
interface QuizEditorProps {
  quizData?: QuizData;
  onUpdate: (quizData: QuizData) => void;
}

function QuizEditor({ quizData, onUpdate }: QuizEditorProps) {
  // Parse quiz_data if it's a string (from backend JSON)
  const parseQuizData = (data: QuizData | string | undefined): QuizData | null => {
    if (!data) {
      console.log('QuizEditor: No quiz_data provided');
      return null;
    }
    
    console.log('QuizEditor: Raw quiz_data:', data);
    console.log('QuizEditor: Type of quiz_data:', typeof data);
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        console.log('QuizEditor: Parsed quiz_data:', parsed);
        console.log('QuizEditor: Questions:', parsed?.questions);
        return parsed;
      } catch (error) {
        console.error('QuizEditor: Error parsing quiz_data:', error);
        return null;
      }
    }
    
    console.log('QuizEditor: Using quiz_data as object:', data);
    return data as QuizData;
  };

  const parsedQuizData = parseQuizData(quizData);
  
  const [questions, setQuestions] = useState<QuizQuestion[]>(parsedQuizData?.questions || []);
  const [passingScore, setPassingScore] = useState(parsedQuizData?.passing_score || 70);

  // Update when quizData prop changes (e.g., when loading existing lesson)
  useEffect(() => {
    const parsed = parseQuizData(quizData);
    if (parsed) {
      console.log('QuizEditor: Updating questions from quizData:', parsed.questions);
      setQuestions(parsed.questions || []);
      setPassingScore(parsed.passing_score || 70);
    } else {
      console.log('QuizEditor: No valid quiz data, resetting to empty');
      setQuestions([]);
      setPassingScore(70);
    }
  }, [quizData]);

  useEffect(() => {
    onUpdate({ questions, passing_score: passingScore });
  }, [questions, passingScore, onUpdate]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Quiz Questions</Label>
        <Button onClick={addQuestion} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Question {index + 1}</span>
                <Button
                  onClick={() => deleteQuestion(question.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  placeholder="Enter question"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, { 
                    type: e.target.value as QuizQuestion['type'],
                    options: e.target.value === 'multiple_choice' ? ['', '', '', ''] : undefined
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              {question.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {question.options?.map((option, optIndex) => (
                    <Input
                      key={optIndex}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[optIndex] = e.target.value;
                        updateQuestion(question.id, { options: newOptions });
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                  ))}
                  <div className="space-y-2 mt-2">
                    <Label>Correct Answer</Label>
                    <Input
                      value={question.correct_answer as string}
                      onChange={(e) => updateQuestion(question.id, { correct_answer: e.target.value })}
                      placeholder="Enter correct answer"
                    />
                  </div>
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <select
                    value={question.correct_answer as string}
                    onChange={(e) => updateQuestion(question.id, { correct_answer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}

              {question.type === 'short_answer' && (
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Input
                    value={question.correct_answer as string}
                    onChange={(e) => updateQuestion(question.id, { correct_answer: e.target.value })}
                    placeholder="Enter correct answer"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  value={question.points || 1}
                  onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Passing Score (%)</Label>
        <Input
          type="number"
          value={passingScore}
          onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
          min="0"
          max="100"
        />
      </div>
    </div>
  );
}

