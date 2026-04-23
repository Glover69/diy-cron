export type Schedule = {
  semester: semester;
  classes: Class[];
  schedule_id: string;
  created_at: Date;
};

export type Toast = {
  header: string;
  message: string;
};

export type Class = {
  course_name: string; // e.g., "Intro to AI"
  days: Days[]; // e.g., ["Monday", "Wednesday"]
  color: string;
  color_light: string; // e.g., "#B54708", "#FFFAEB"
};

export type semester = {
  id: string; // Unique identifier for the semester, e.g., "fall-2025"
  schedule_name: string; // e.g., "Fall 2025"
  start_date: string; // e.g., "2025-08-05"
  end_date: string; // e.g., "2025-12-15"
  excluded_dates?: string[]; // e.g., ["2025-10-10", "2025-11-01"]
};

export type Days = {
  day: string; // e.g., "Monday"
  start_time: any;
  end_time: any;
  room: string;
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  profileImage: string;
}

export type LoginResponse = {
  token: string;
  user: GoogleUser
};

// export interface CronJob {
//   id: number;
//   name: string;
//   url: string;
//   schedule: string;
//   scheduleLabel: string;
//   nextRun: string;
//   status: 'active' | 'warning' | 'inactive';
//   img: string;
// }


export type CronJob = {
    cronId: string;
    cronName: string;
    description: string;
    endpointUrl: string;
    httpMethod: string;
    scheduleType: string;
    scheduleExpression: string;
    scheduleLabel: string; // TBA
    nextRunAt: string;
    isActive: boolean;
    jobStatus: 'ACTIVE' | 'ISSUES' | 'PAUSED'; // TBA
    createdAt?: string;
    updatedAt?: string;
    timeoutSeconds?: number;
    headers?: {key: string; value: string}[];
    payload?: string;
    retryCount?: number;
    retryStrategy?: string;
    notifyOn?: string;
    retryDelay?: number;
    totalExecutions: number;
    successRate: number;
    avgResponseTimeMs: number;
}


export type CronCreateRequest = {
    cronName: string;
    description?: string;
    endpointUrl: string;
    httpMethod: string;
    scheduleType: string;
    scheduleExpression: string;
    isActive: boolean;
    timeoutSeconds?: number;
    headers?: Record<string, string>;
    payload?: string;
    retryCount?: number;
    retryDelay?: number;
    retryStrategy?: string;
    notifyOn?: string;
}

export type ToastProps = {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export type LogsResponse = {
    name: string;
    responseTime: string;
    statusCode: number;
}

export type ExecutionLogs = {
  logId: string;
  cronId: string;
  executedAt: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  httpStatusCode: number;
  responseTimeMS: number;
  responseBody: string;
  errorMessage: string;
}
