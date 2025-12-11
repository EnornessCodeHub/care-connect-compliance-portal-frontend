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
  Loader2,
  FileText,
  Download,
  Play
} from 'lucide-react';
import { QuizData, QuizQuestion } from '@/services/courseService';

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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<string, string | number>>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});

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
    <>
      <style>{`
        .lesson-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .lesson-content iframe {
          width: 100%;
          max-width: 560px;
          height: auto;
          aspect-ratio: 16 / 9;
          margin: 1rem 0;
          border-radius: 8px;
        }
        .lesson-content video {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 8px;
        }
        .lesson-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3,
        .lesson-content h4, .lesson-content h5, .lesson-content h6 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .lesson-content ul, .lesson-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .lesson-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        .lesson-content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .lesson-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .lesson-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .lesson-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .lesson-content a:hover {
          color: #2563eb;
        }
      `}</style>
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

                    {/* Lesson Content Based on Type */}
                    {selectedLesson.lesson_type === 'text' && (
                      <div className="prose max-w-none">
                        {selectedLesson.content ? (
                          <div 
                            className="text-base leading-relaxed lesson-content"
                            dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                            style={{
                              wordBreak: 'break-word'
                            }}
                          />
                        ) : (
                          <div className="text-muted-foreground italic">
                            No content available for this lesson yet.
                          </div>
                        )}
                      </div>
                    )}

                    {selectedLesson.lesson_type === 'pdf' && (() => {
                      // Construct full PDF URL
                      const getPdfUrl = (pdfUrl: string | undefined): string | null => {
                        if (!pdfUrl) return null;
                        
                        // If already a full URL, return as is
                        if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
                          return pdfUrl;
                        }
                        
                        // Get base URL from environment and remove /api/v1
                        const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/v1';
                        const serverBase = baseUrl.replace('/api/v1', '');
                        
                        // If pdfUrl starts with course_pdfs/, use it directly
                        if (pdfUrl.startsWith('/course_pdfs/')) {
                          return `${serverBase}${pdfUrl}`;
                        }
                        
                        // Otherwise, assume it's just the filename
                        return `${serverBase}/course_pdfs/${pdfUrl}`;
                      };
                      
                      const fullPdfUrl = getPdfUrl(selectedLesson.pdf_url);
                      
                      return (
                        <div className="space-y-4">
                          {fullPdfUrl ? (
                            <div className="border rounded-lg p-6 bg-muted/50">
                              <div className="flex items-center gap-4 mb-4">
                                <FileText className="h-8 w-8 text-primary" />
                                <div className="flex-1">
                                  <h3 className="font-semibold">PDF Document</h3>
                                  <p className="text-sm text-muted-foreground">
                                    View or download the PDF file
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  asChild
                                  variant="default"
                                  className="flex-1 sm:flex-none"
                                >
                                  <a
                                    href={fullPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <Play className="h-4 w-4" />
                                    View PDF
                                  </a>
                                </Button>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="flex-1 sm:flex-none"
                                >
                                  <a
                                    href={fullPdfUrl}
                                    download
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download
                                  </a>
                                </Button>
                              </div>
                              <div className="mt-4">
                                <iframe
                                  src={`${fullPdfUrl}#toolbar=0`}
                                  className="w-full h-[600px] border rounded"
                                  title="PDF Viewer"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic text-center py-8 border rounded-lg">
                              No PDF file available for this lesson yet.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {selectedLesson.lesson_type === 'quiz' && (() => {
                      // Parse quiz_data if it's a string
                      let parsedQuizData: QuizData | null = null;
                      
                      if (selectedLesson.quiz_data) {
                        try {
                          // Debug: Log the raw quiz_data
                          console.log('Raw quiz_data:', selectedLesson.quiz_data);
                          console.log('Type of quiz_data:', typeof selectedLesson.quiz_data);
                          
                          if (typeof selectedLesson.quiz_data === 'string') {
                            parsedQuizData = JSON.parse(selectedLesson.quiz_data);
                          } else {
                            parsedQuizData = selectedLesson.quiz_data as QuizData;
                          }
                          
                          // Debug: Log parsed data
                          console.log('Parsed quiz_data:', parsedQuizData);
                          console.log('Questions:', parsedQuizData?.questions);
                        } catch (error) {
                          console.error('Error parsing quiz_data:', error);
                          parsedQuizData = null;
                        }
                      } else {
                        console.log('No quiz_data found in selectedLesson:', selectedLesson);
                      }
                      
                      if (!parsedQuizData) {
                        return (
                          <div className="text-center py-8 text-muted-foreground border rounded-lg">
                            <p>No quiz data available for this lesson.</p>
                            <p className="text-xs mt-2">Debug: lesson_type={selectedLesson.lesson_type}, quiz_data={selectedLesson.quiz_data ? 'exists' : 'missing'}</p>
                          </div>
                        );
                      }
                      
                      return (
                        <QuizViewer
                          lessonId={selectedLesson.id}
                          quizData={parsedQuizData}
                          quizAnswers={quizAnswers[selectedLesson.id] || {}}
                          quizSubmitted={quizSubmitted[selectedLesson.id] || false}
                          quizScore={quizScores[selectedLesson.id]}
                          onAnswerChange={(questionId, answer) => {
                            setQuizAnswers(prev => ({
                              ...prev,
                              [selectedLesson.id]: {
                                ...(prev[selectedLesson.id] || {}),
                                [questionId]: answer
                              }
                            }));
                          }}
                          onSubmit={(score) => {
                            setQuizSubmitted(prev => ({
                              ...prev,
                              [selectedLesson.id]: true
                            }));
                            setQuizScores(prev => ({
                              ...prev,
                              [selectedLesson.id]: score
                            }));
                          }}
                        />
                      );
                    })()}

                    {!selectedLesson.lesson_type && (
                      <div className="prose max-w-none">
                        {selectedLesson.content ? (
                          <div 
                            className="text-base leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                          />
                        ) : (
                          <div className="text-muted-foreground italic">
                            No content available for this lesson yet.
                          </div>
                        )}
                      </div>
                    )}

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
    </>
  );
}

// Quiz Viewer Component
interface QuizViewerProps {
  lessonId: number;
  quizData: QuizData;
  quizAnswers: Record<string, string | number>;
  quizSubmitted: boolean;
  quizScore?: number;
  onAnswerChange: (questionId: string, answer: string | number) => void;
  onSubmit: (score: number) => void;
}

function QuizViewer({
  quizData,
  quizAnswers,
  quizSubmitted,
  quizScore,
  onAnswerChange,
  onSubmit
}: QuizViewerProps) {
  const { toast } = useToast();
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | number>>(quizAnswers);

  // Ensure quizData and questions exist
  if (!quizData || !quizData.questions || !Array.isArray(quizData.questions)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No quiz data available for this lesson.</p>
      </div>
    );
  }

  const questions = quizData.questions || [];
  const passingScore = quizData.passing_score || 70;

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setLocalAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    onAnswerChange(questionId, answer);
  };

  const handleSubmit = () => {
    if (questions.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No questions in this quiz."
      });
      return;
    }

    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = localAnswers[question.id];
      const correctAnswer = question.correct_answer;

      if (userAnswer !== undefined) {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          if (Number(userAnswer) === Number(correctAnswer)) {
            correctCount++;
            earnedPoints += question.points;
          }
        } else if (question.type === 'short_answer') {
          const userAnswerStr = String(userAnswer).toLowerCase().trim();
          const correctAnswerStr = String(correctAnswer).toLowerCase().trim();
          if (userAnswerStr === correctAnswerStr) {
            correctCount++;
            earnedPoints += question.points;
          }
        }
      }
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= passingScore;

    onSubmit(percentage);

    toast({
      title: passed ? "🎉 Quiz Passed!" : "Quiz Completed",
      description: `You scored ${percentage.toFixed(1)}% (${earnedPoints}/${totalPoints} points). ${passed ? `Passing score: ${passingScore}%` : `You need ${passingScore}% to pass.`}`,
      variant: passed ? "default" : "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Quiz Instructions
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Answer all questions below. You need to score at least {passingScore}% to pass this quiz.
        </p>
        {quizSubmitted && quizScore !== undefined && (
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Your Score: {quizScore.toFixed(1)}%
              {quizScore >= passingScore ? (
                <span className="ml-2 text-green-600 dark:text-green-400">✓ Passed</span>
              ) : (
                <span className="ml-2 text-red-600 dark:text-red-400">✗ Failed</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = localAnswers[question.id];
          const correctAnswer = question.correct_answer;
          const isCorrect = quizSubmitted && userAnswer !== undefined && 
            (question.type === 'multiple_choice' || question.type === 'true_false' 
              ? Number(userAnswer) === Number(correctAnswer)
              : String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim());

          return (
            <Card key={question.id} className={quizSubmitted ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{question.question}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </p>

                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label
                              key={optIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                quizSubmitted
                                  ? optIndex === Number(correctAnswer)
                                    ? 'bg-green-50 dark:bg-green-950 border-green-500'
                                    : Number(userAnswer) === optIndex && optIndex !== Number(correctAnswer)
                                    ? 'bg-red-50 dark:bg-red-950 border-red-500'
                                    : 'bg-muted border-muted-foreground/20'
                                  : userAnswer === optIndex
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted border-border'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optIndex}
                                checked={userAnswer === optIndex}
                                onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
                                disabled={quizSubmitted}
                                className="w-4 h-4"
                              />
                              <span className="flex-1">{option}</span>
                              {quizSubmitted && optIndex === Number(correctAnswer) && (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'true_false' && (
                        <div className="space-y-2">
                          {['True', 'False'].map((option, optIndex) => (
                            <label
                              key={optIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                quizSubmitted
                                  ? optIndex === Number(correctAnswer)
                                    ? 'bg-green-50 dark:bg-green-950 border-green-500'
                                    : Number(userAnswer) === optIndex && optIndex !== Number(correctAnswer)
                                    ? 'bg-red-50 dark:bg-red-950 border-red-500'
                                    : 'bg-muted border-muted-foreground/20'
                                  : userAnswer === optIndex
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted border-border'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optIndex}
                                checked={userAnswer === optIndex}
                                onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
                                disabled={quizSubmitted}
                                className="w-4 h-4"
                              />
                              <span className="flex-1">{option}</span>
                              {quizSubmitted && optIndex === Number(correctAnswer) && (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'short_answer' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={userAnswer !== undefined ? String(userAnswer) : ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            disabled={quizSubmitted}
                            placeholder="Enter your answer"
                            className={`w-full px-4 py-2 border rounded-lg ${
                              quizSubmitted
                                ? isCorrect
                                  ? 'bg-green-50 dark:bg-green-950 border-green-500'
                                  : 'bg-red-50 dark:bg-red-950 border-red-500'
                                : ''
                            }`}
                          />
                          {quizSubmitted && (
                            <div className="text-sm">
                              {isCorrect ? (
                                <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Correct! The answer is: {String(correctAnswer)}
                                </p>
                              ) : (
                                <p className="text-red-600 dark:text-red-400">
                                  Incorrect. The correct answer is: {String(correctAnswer)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!quizSubmitted && (
        <div className="pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(localAnswers).length < questions.length}
            className="w-full sm:w-auto"
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
