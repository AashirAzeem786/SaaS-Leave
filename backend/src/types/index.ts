export interface User {
  id: string;
  username: string;
  password: string;
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

export interface LeaveBalance {
  employeeId: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
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
