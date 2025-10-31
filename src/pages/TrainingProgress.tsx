import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import staffService, { Staff } from '@/services/staffService';
import courseService, { CourseProgress as CourseProgressType } from '@/services/courseService';
import authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type CourseProgress = {
  id: string;
  courseName: string;
  staffName: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  enrollmentDate: string | null;
  completionDate: string | null;
};

const TrainingProgress = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [staffFilter, setStaffFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [courseProgressData, setCourseProgressData] = useState<CourseProgress[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data on component mount
    useEffect(() => {
      loadStaffList();
    }, []);

    // Load progress data after staff list is loaded (so we can match staff names)
    useEffect(() => {
      // Only load progress data when staff list loading is complete
      if (!loadingStaff && (staffList.length > 0 || !loadingStaff)) {
        loadProgressData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingStaff, staffList.length]);

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

    const loadProgressData = async () => {
      try {
        setError(null);
        setLoadingProgress(true);
        const user = authService.getUserData();
        
        if (!user) {
          setError("User not authenticated");
          toast({
            variant: "destructive",
            title: "Error",
            description: "User not authenticated"
          });
          return;
        }

        let response;
        
        // If admin, fetch all courses progress
        if (user.role === 'admin') {
          response = await courseService.getAllCoursesProgress();
        } else {
          // If staff, fetch only their progress
          response = await courseService.getAllUserProgress(user.id);
        }

        if (response.success && response.data) {
          console.log('Progress API Response:', response.data);
          console.log('Staff List:', staffList);
          
          // Handle both array and single object responses
          const dataArray = Array.isArray(response.data) ? response.data : [response.data];
          
          // Transform API data to component format
          const transformedData: CourseProgress[] = dataArray.map((item: any, index: number) => {
            // Backend returns user_name, user_id, course_title - map to our format
            const courseId = item.course_id || item.courseId;
            const courseName = item.course_name || item.course_title || item.courseTitle || '';
            const staffId = item.staff_id || item.user_id || item.userId;
            // Backend returns user_name, but our interface expects staff_name
            let staffName = item.staff_name || item.user_name || item.userName || '';
            
            // Calculate status based on progress
            const progress = item.progress || item.progress_percentage || item.progressPercentage || 0;
            let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
            if (progress === 100) {
              status = 'completed';
            } else if (progress > 0) {
              status = 'in-progress';
            }
            
            console.log(`Processing item ${index}:`, {
              course_id: courseId,
              course_name: courseName,
              staff_id: staffId,
              staff_name: staffName,
              user_name: item.user_name,
              progress: progress,
              staffListLength: staffList.length
            });
            
            // If staff_name/user_name is empty/null/undefined, try to find it from staffList
            if ((!staffName || staffName.trim() === '') && staffId) {
              // Try to find staff by ID (handle both string and number comparisons)
              const staff = staffList.find(s => {
                // Handle type mismatches - compare as both string and number
                const staffIdNum = typeof s.id === 'string' ? parseInt(s.id, 10) : s.id;
                const itemStaffIdNum = typeof staffId === 'string' ? parseInt(staffId, 10) : staffId;
                
                const matches = s.id === staffId || 
                       staffIdNum === itemStaffIdNum ||
                       s.id === itemStaffIdNum ||
                       staffIdNum === staffId ||
                       String(s.id) === String(staffId);
                
                if (matches) {
                  console.log(`Found staff match:`, s);
                }
                
                return matches;
              });
              
              if (staff) {
                staffName = staff.fullname || staff.username || staff.email || '';
                console.log(`Resolved staff name from list: ${staffName}`);
              } else {
                console.log(`Staff not found in list for ID: ${staffId}`);
              }
            }
            
            // If still no name, check if we have user info from the current user
            if ((!staffName || staffName.trim() === '') && staffId) {
              const currentUser = authService.getUserData();
              if (currentUser) {
                const userIdNum = typeof currentUser.id === 'string' ? parseInt(currentUser.id, 10) : currentUser.id;
                const itemStaffIdNum = typeof staffId === 'string' ? parseInt(staffId, 10) : staffId;
                
                if (currentUser.id === staffId || 
                    userIdNum === itemStaffIdNum ||
                    currentUser.id === itemStaffIdNum ||
                    userIdNum === staffId) {
                  staffName = currentUser.fullname || currentUser.username || currentUser.email || '';
                  console.log(`Resolved staff name from current user: ${staffName}`);
                }
              }
            }
            
            // Final fallback - if we have staff_id, show it
            if ((!staffName || staffName.trim() === '') && staffId) {
              staffName = `User ${staffId}`;
            }
            
            return {
              id: `${courseId}-${staffId}-${index}`,
              courseName: courseName || 'Unknown Course',
              staffName: staffName && staffName.trim() !== '' ? staffName : 'Unknown',
              status: item.status || status,
              progress: progress,
              enrollmentDate: item.enrollment_date || item.enrollmentDate
                ? format(new Date(item.enrollment_date || item.enrollmentDate), 'yyyy-MM-dd')
                : null,
              completionDate: item.completion_date || item.completionDate
                ? format(new Date(item.completion_date || item.completionDate), 'yyyy-MM-dd')
                : null,
            };
          });

          setCourseProgressData(transformedData);
        }
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to load progress data";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        });
      } finally {
        setLoadingProgress(false);
      }
    };

    // Get staff names for filter from fetched staff list
    const staffNames = useMemo(() => {
      return staffList.map(staff => ({
        id: staff.id,
        name: staff.fullname || staff.username,
        displayName: staff.fullname || staff.username
      })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    }, [staffList]);

    // Filter and search
    const filteredData = useMemo(() => {
      let filtered = courseProgressData;

      // Staff filter
      if (staffFilter !== 'all') {
        filtered = filtered.filter(item => item.staffName === staffFilter);
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          item =>
            item.courseName.toLowerCase().includes(query) ||
            item.staffName.toLowerCase().includes(query)
        );
      }

      return filtered;
    }, [searchQuery, staffFilter, courseProgressData]);

    // Calculate statistics
    const stats = useMemo(() => {
      const total = filteredData.length;
      const completed = filteredData.filter(item => item.status === 'completed').length;
      const inProgress = filteredData.filter(item => item.status === 'in-progress').length;
      const notStarted = filteredData.filter(item => item.status === 'not-started').length;

      return { total, completed, inProgress, notStarted };
    }, [filteredData]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredData.slice(start, end);
    }, [filteredData, currentPage, itemsPerPage]);

    const getStatusBadge = (status: CourseProgress['status']) => {
      switch (status) {
        case 'completed':
          return (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          );
        case 'in-progress':
          return (
            <Badge variant="default" className="bg-blue-500">
              <Clock className="h-3 w-3 mr-1" />
              Ongoing
            </Badge>
          );
        case 'not-started':
          return (
            <Badge variant="secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              Not Started
            </Badge>
          );
      }
    };

    const getProgressColor = (progress: number) => {
      if (progress === 0) return 'bg-gray-300';
      if (progress < 50) return 'bg-orange-500';
      if (progress < 100) return 'bg-blue-500';
      return 'bg-green-500';
    };

    // Show error state
    if (error && !loadingProgress && !loadingStaff) {
      return (
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => loadProgressData()} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Progress Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notStarted}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={staffFilter} onValueChange={setStaffFilter} disabled={loadingStaff}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  {loadingStaff ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading staff...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Filter by staff name" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staffNames.length === 0 && !loadingStaff && (
                    <SelectItem value="no-staff" disabled>No staff found</SelectItem>
                  )}
                  {staffNames.map(staff => (
                    <SelectItem key={staff.id} value={staff.displayName}>
                      {staff.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Loading progress data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Course Name</th>
                      <th className="py-3 pr-4 font-medium">Staff Name</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Progress</th>
                      <th className="py-3 pr-4 font-medium">Enrollment Date</th>
                      <th className="py-3 pr-4 font-medium">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          {loadingProgress ? 'Loading...' : (searchQuery || staffFilter !== 'all' ? 'No matching courses found' : 'No course progress data available')}
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-4 pr-4 font-medium">{item.courseName}</td>
                          <td className="py-4 pr-4">{item.staffName || 'Unknown'}</td>
                          <td className="py-4 pr-4">{getStatusBadge(item.status)}</td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="relative h-2 w-full flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className={cn(
                                    'h-full transition-all',
                                    getProgressColor(item.progress)
                                  )}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {item.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            {item.enrollmentDate || 'N/A'}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            {item.completionDate || 'Not completed'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loadingProgress && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} courses
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
};

export default TrainingProgress;
