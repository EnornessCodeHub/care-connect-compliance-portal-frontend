import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  addCertificate,
  generateCertificateNumber,
  loadCertificates,
  generateId
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import courseService, { Course, Chapter, Lesson } from '@/services/courseService';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Award,
  Loader2
} from 'lucide-react';

interface FlatLesson extends Lesson {
  chapterId: number;
  chapterTitle: string;
  chapterOrder: number;
}

export default function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = id ? parseInt(id) : 0;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);

  // Load course data and progress
  useEffect(() => {
    if (courseId) {
      loadCourseData();
      loadUserProgress();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseResponse, chaptersResponse] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getChaptersByCourse(courseId)
      ]);

      if (courseResponse.success && courseResponse.data) {
        setCourse(courseResponse.data);
      }

      if (chaptersResponse.success && chaptersResponse.data) {
        // Load lessons for each chapter
        const chaptersWithLessons = await Promise.all(
          chaptersResponse.data.map(async (chapter) => {
            try {
              const lessonsResponse = await courseService.getLessonsByChapter(courseId, chapter.id);
              return {
                ...chapter,
                lessons: lessonsResponse.success && lessonsResponse.data 
                  ? lessonsResponse.data.filter(l => l.is_active)
                  : []
              };
            } catch {
              return { ...chapter, lessons: [] };
            }
          })
        );
        setChapters(chaptersWithLessons);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load course data"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    const user = authService.getUserData();
    if (!user || !courseId) return;

    try {
      const response = await courseService.getUserCourseProgress(courseId, user.id);
      if (response.success && response.data) {
        setCompletedLessonIds(new Set(response.data.completed_lesson_ids || []));
        
        // Check certificate status
        const certificates = loadCertificates();
        const existingCert = certificates.find(
          c => c.courseId === String(courseId) && c.userId === String(user.id)
        );
        setCertificateIssued(!!existingCert);
      }
    } catch (error: any) {
      // If progress doesn't exist yet, that's fine
      console.log('No progress found for this course yet');
    }
  };

  // Flatten all lessons with chapter info
  const flatLessons = useMemo(() => {
    const lessons: FlatLesson[] = [];
    chapters
      .sort((a, b) => a.order - b.order)
      .forEach(chapter => {
        chapter.lessons
          ?.sort((a, b) => a.order - b.order)
          .forEach(lesson => {
            lessons.push({
              ...lesson,
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              chapterOrder: chapter.order,
            });
          });
      });
    return lessons;
  }, [chapters]);

  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
    flatLessons.length > 0 ? flatLessons[0].id : null
  );

  useEffect(() => {
    if (flatLessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(flatLessons[0].id);
    }
  }, [flatLessons]);

  const selectedLesson = useMemo(() => {
    return flatLessons.find(lesson => lesson.id === selectedLessonId);
  }, [flatLessons, selectedLessonId]);

  const currentLessonIndex = useMemo(() => {
    return flatLessons.findIndex(lesson => lesson.id === selectedLessonId);
  }, [flatLessons, selectedLessonId]);

  const totalLessons = flatLessons.length;
  const completedCount = completedLessonIds.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isCompleted = totalLessons > 0 && completedCount === totalLessons;

  // Auto-generate certificate when course is completed
  useEffect(() => {
    if (!course || !courseId || !isCompleted || !course.certificate_enabled || certificateIssued) return;
    
    const user = authService.getUserData();
    if (!user) return;

    const certificates = loadCertificates();
    const existingCert = certificates.find(
      c => c.courseId === String(courseId) && c.userId === String(user.id)
    );

    if (!existingCert) {
      const certificate = {
        id: generateId('cert'),
        courseId: String(courseId),
        courseName: course.title,
        userId: String(user.id),
        userName: user.username,
        userFullName: user.fullname || user.username,
        issuedAt: new Date().toISOString(),
        certificateNumber: generateCertificateNumber(),
      };

      addCertificate(certificate);
      setCertificateIssued(true);

      toast({
        title: "🎉 Course Completed!",
        description: "Congratulations! Your certificate has been issued.",
        variant: "default",
      });
    }
  }, [isCompleted, course, courseId, certificateIssued, toast]);

  const handleMarkComplete = async () => {
    if (!selectedLessonId || !courseId) return;
    
    if (completedLessonIds.has(selectedLessonId)) {
      return; // Already completed
    }

    try {
      setMarkingComplete(true);
      const response = await courseService.markLessonComplete(courseId, selectedLessonId);
      
      if (response.success) {
        setCompletedLessonIds(prev => new Set([...prev, selectedLessonId]));
        
        toast({
          title: "Success",
          description: "Lesson marked as complete"
        });

        // If course is now completed, reload progress to get certificate status
        if (response.data?.is_course_completed) {
          await loadUserProgress();
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to mark lesson as complete"
      });
    } finally {
      setMarkingComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setSelectedLessonId(flatLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < flatLessons.length - 1) {
      setSelectedLessonId(flatLessons[currentLessonIndex + 1].id);
    }
  };

  // Group lessons by chapter
  const chaptersWithLessons = useMemo(() => {
    return chapters
      .sort((a, b) => a.order - b.order)
      .filter(chapter => chapter.lessons && chapter.lessons.length > 0);
  }, [chapters]);

  if (loading) {
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
          <div className="mt-4">
            <Button asChild variant="outline"><Link to="/course">Back to Courses</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  if (flatLessons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">No lessons available yet.</p>
          <div className="mt-4">
            <Button asChild variant="outline"><Link to="/course">Back to Courses</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/course">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to course
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{course.title}</h1>
            </div>
          </div>
          {selectedLesson && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{currentLessonIndex + 1}/{totalLessons}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Course Navigation */}
        <div className="w-80 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Course Info */}
            <div className="space-y-2">
              <h2 className="font-semibold text-sm">{course.title}</h2>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground">{progress}% complete</div>
            </div>

            {/* Chapters and Lessons */}
            <div className="space-y-4">
              {chaptersWithLessons.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {chapter.title}
                  </h3>
                  <div className="space-y-1">
                    {chapter.lessons?.map((lesson) => {
                      const isSelected = lesson.id === selectedLessonId;
                      const isCompleted = completedLessonIds.has(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Lesson Viewer */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="container mx-auto px-6 py-8 max-w-4xl">
              {/* Lesson Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentLessonIndex === flatLessons.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Lesson Content */}
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedLesson.title}</h2>
                      <p className="text-muted-foreground">Lesson {currentLessonIndex + 1} of {totalLessons}</p>
                    </div>

                    {selectedLesson.description && (
                      <p className="text-lg text-muted-foreground">{selectedLesson.description}</p>
                    )}

                    <div className="prose max-w-none">
                      {selectedLesson.content ? (
                        <div 
                          className="text-base leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                        />
                      ) : (
                        <div className="text-muted-foreground italic">
                          No content available for this lesson yet.
                        </div>
                      )}
                    </div>

                    {/* Mark as Complete Button */}
                    <div className="pt-6 border-t space-y-4">
                      <Button
                        onClick={handleMarkComplete}
                        disabled={completedLessonIds.has(selectedLesson.id) || markingComplete}
                        className="w-full sm:w-auto"
                      >
                        {markingComplete ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : completedLessonIds.has(selectedLesson.id) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                      
                      {/* Course Completion Banner */}
                      {isCompleted && course.certificate_enabled && certificateIssued && (
                        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                          <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-900 dark:text-green-100">
                              Course Completed! 🎉
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Your certificate has been issued. View it in your certificates section.
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link to="/course/certificates">
                              View Certificate
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
