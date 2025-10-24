export interface User {
  id: string;
  username: string;
  role: 'Employee' | 'Manager';
  name: string;
  email: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApplyLeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApproveLeaveRequest {
  status: 'approved' | 'rejected';
  comments?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LeaveSummary {
  employeeId: string;
  employeeName: string;
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  totalDays: number;
}
