import { User, LeaveRequest, LeaveBalance } from '../types';

// Mock users with hardcoded credentials
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'employee',
    password: 'password123',
    role: 'Employee',
    name: 'John Doe',
    email: 'john.doe@company.com'
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'Manager',
    name: 'Jane Smith',
    email: 'jane.smith@company.com'
  },
  {
    id: '3',
    username: 'alice',
    password: 'alice123',
    role: 'Employee',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com'
  }
];

// In-memory storage for leave requests
export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    reason: 'Personal vacation',
    status: 'pending',
    appliedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Alice Johnson',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    reason: 'Medical appointment',
    status: 'approved',
    appliedAt: '2024-01-08T14:30:00Z',
    reviewedAt: '2024-01-09T09:15:00Z',
    reviewedBy: 'Jane Smith'
  }
];

// Mock leave balances
export const leaveBalances: LeaveBalance[] = [
  {
    employeeId: '1',
    totalDays: 20,
    usedDays: 5,
    remainingDays: 15
  },
  {
    employeeId: '3',
    totalDays: 20,
    usedDays: 3,
    remainingDays: 17
  }
];

// Helper functions for data management
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const findUserByCredentials = (username: string, password: string): User | undefined => {
  return mockUsers.find(user => user.username === username && user.password === password);
};

export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getLeaveBalance = (employeeId: string): LeaveBalance | undefined => {
  return leaveBalances.find(balance => balance.employeeId === employeeId);
};

export const updateLeaveBalance = (employeeId: string, daysUsed: number): void => {
  const balance = getLeaveBalance(employeeId);
  if (balance) {
    balance.usedDays += daysUsed;
    balance.remainingDays -= daysUsed;
  }
};
