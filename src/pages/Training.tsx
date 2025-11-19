import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import courseService from '@/services/courseService';
import authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CourseWithProgress extends courseService.Course {
  progress?: number;
  isCompleted?: boolean;
}

const Training = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const user = authService.getUserData();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // If staff, fetch only assigned courses
      const params = user?.role === 'staff' 
        ? { assignedTo: user.id, status: 'all' }
        : { status: 'all' };

      const response = await courseService.getAllCourses(params);
      if (response.success && response.data) {
        setCourses(response.data);
        
        // Load progress for each course if user is staff
        if (user.role === 'staff') {
          loadCourseProgress(response.data, user.id);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load courses"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCourseProgress = async (coursesList: courseService.Course[], userId: number) => {
    try {
      setProgressLoading(true);
      
      // Fetch progress for all courses in parallel
      const progressPromises = coursesList.map(async (course) => {
        try {
          const progressResponse = await courseService.getUserCourseProgress(course.id, userId);
          if (progressResponse.success && progressResponse.data) {
            return {
              courseId: course.id,
              progress: progressResponse.data.progress_percentage || 0,
              isCompleted: progressResponse.data.is_completed || false
            };
          }
        } catch (error) {
          console.warn(`Failed to load progress for course ${course.id}:`, error);
          return {
            courseId: course.id,
            progress: 0,
            isCompleted: false
          };
        }
        return {
          courseId: course.id,
          progress: 0,
          isCompleted: false
        };
      });

      const progressResults = await Promise.all(progressPromises);
      
      // Update courses with progress data
      setCourses(prevCourses => 
        prevCourses.map(course => {
          const progressData = progressResults.find(p => p.courseId === course.id);
          return {
            ...course,
            progress: progressData?.progress || 0,
            isCompleted: progressData?.isCompleted || false
          };
        })
      );
    } catch (error: any) {
      console.error('Error loading course progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  const isAdmin = authService.isAdmin();

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/course/manage">Manage Courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/course/create">Add Course</Link>
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No courses yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="h-40 bg-muted flex items-center justify-center">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-muted-foreground">No Thumbnail</span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description || 'No description'}</p>
                <div>
                  <Progress 
                    value={c.progress !== undefined ? c.progress : 0} 
                    className="h-2" 
                  />
                  <div className="text-xs text-right text-muted-foreground mt-1">
                    {progressLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : (
                      `${c.progress !== undefined ? c.progress : 0}%`
                    )}
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/course/${c.id}`}>
                    {c.isCompleted ? 'View Course' : 'Continue to course'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;
