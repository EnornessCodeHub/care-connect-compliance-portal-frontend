import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import trainingReportService, {
  TrainingReportRow,
  TrainingType,
  TrainingStatus,
} from '@/services/trainingReportService';
import { Download, FileSpreadsheet, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeOptions: (TrainingType | 'All')[] = ['All', 'Course', 'Notification Training'];
const statusOptions: (TrainingStatus | 'All')[] = [
  'All',
  'Not Started',
  'In Progress',
  'Completed',
  'Acknowledged',
  'Outstanding',
];

const formatDate = (value: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const MasterTrainingReport: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<TrainingReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [employeeFilter, setEmployeeFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<TrainingType | ''>('');
  const [statusFilter, setStatusFilter] = useState<TrainingStatus | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await trainingReportService.getMasterReport({
        employeeName: employeeFilter || undefined,
        trainingItem: itemFilter || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });

      if (response.success && response.data) {
        setRows(response.data);
      } else {
        setRows([]);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'Failed to load training report',
        });
      }
    } catch (error: any) {
      console.error('MasterTrainingReport loadData error', error);
      setRows([]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load training report',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => rows, [rows]);

  const handleApplyFilters = () => {
    loadData();
  };

  const handleResetFilters = () => {
    setEmployeeFilter('');
    setItemFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setTimeout(() => loadData(), 0);
  };

  const handleExportCSV = () => {
    if (!filteredRows.length) {
      toast({
        variant: 'destructive',
        title: 'Nothing to export',
        description: 'No training records match the current filters.',
      });
      return;
    }

    const header = ['Employee', 'Date', 'Training Item', 'Type', 'Status'];
    const lines = [
      header.join(','),
      ...filteredRows.map((row) =>
        [
          `"${row.employee.replace(/"/g, '""')}"`,
          `"${formatDate(row.date)}"`,
          `"${row.training_item.replace(/"/g, '""')}"`,
          `"${row.type}"`,
          `"${row.status}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'master-training-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!filteredRows.length) {
      toast({
        variant: 'destructive',
        title: 'Nothing to export',
        description: 'No training records match the current filters.',
      });
      return;
    }
    // Simple approach: use browser print dialog; user can Save as PDF
    window.print();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Master Training Report</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4 mr-1', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Employee</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  placeholder="Search by employee name"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Training Item</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value)}
                  placeholder="Search by training item"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select
                value={typeFilter || 'All'}
                onValueChange={(value) =>
                  setTypeFilter(value === 'All' ? '' : (value as TrainingType))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select
                value={statusFilter || 'All'}
                onValueChange={(value) =>
                  setStatusFilter(value === 'All' ? '' : (value as TrainingStatus))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between pt-2 border-t">
            <div className="space-x-2">
              <Button size="sm" onClick={handleApplyFilters} disabled={loading}>
                <Search className="h-4 w-4 mr-1" />
                Apply Filters
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetFilters} disabled={loading}>
                Clear
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Training Records{' '}
            <span className="text-xs font-normal text-muted-foreground">
              ({filteredRows.length} items)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Employee</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[240px]">Training Item</TableHead>
                  <TableHead className="min-w-[140px]">Type</TableHead>
                  <TableHead className="min-w-[140px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading training records...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No training records found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow key={`${row.employee_id}-${row.training_item}-${index}`}>
                      <TableCell className="whitespace-nowrap">{row.employee}</TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell className="max-w-md">
                        <span className="line-clamp-2 break-words">{row.training_item}</span>
                      </TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterTrainingReport;


