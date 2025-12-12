import api from '@/lib/axios';

export type TrainingType = 'Course' | 'Notification Training';
export type TrainingStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Acknowledged'
  | 'Outstanding';

export interface TrainingReportRow {
  employee_id: number;
  employee: string;
  date: string | null;
  training_item: string;
  type: TrainingType;
  status: TrainingStatus;
}

export interface TrainingReportResponse {
  success: boolean;
  message: string;
  data: TrainingReportRow[];
  count: number;
}

export interface TrainingReportFilters {
  employeeName?: string;
  trainingItem?: string;
  type?: TrainingType | '';
  status?: TrainingStatus | '';
}

const trainingReportService = {
  async getMasterReport(filters: TrainingReportFilters = {}): Promise<TrainingReportResponse> {
    const params = new URLSearchParams();

    if (filters.employeeName) params.append('employeeName', filters.employeeName);
    if (filters.trainingItem) params.append('trainingItem', filters.trainingItem);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = `/reports/master-training${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<TrainingReportResponse>(url);
    return response.data;
  },
};

export default trainingReportService;


