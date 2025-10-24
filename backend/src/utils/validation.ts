import { LeaveRequest } from '../types';
import { leaveRequests, getLeaveBalance } from '../data/mockData';

export const validateDateRange = (startDate: string, endDate: string): { isValid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  // Check if start date is not in the past
  if (start < today) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  // Check if end date is not before start date
  if (end < start) {
    return { isValid: false, error: 'End date cannot be before start date' };
  }

  return { isValid: true };
};

export const checkOverlappingRequests = (employeeId: string, startDate: string, endDate: string, excludeId?: string): { hasOverlap: boolean; error?: string } => {
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  const overlappingRequest = leaveRequests.find(request => {
    if (request.employeeId !== employeeId || request.id === excludeId) {
      return false;
    }

    if (request.status === 'rejected') {
      return false;
    }

    const existingStart = new Date(request.startDate);
    const existingEnd = new Date(request.endDate);

    // Check for overlap
    return (newStart <= existingEnd && newEnd >= existingStart);
  });

  if (overlappingRequest) {
    return {
      hasOverlap: true,
      error: `You already have a leave request from ${overlappingRequest.startDate} to ${overlappingRequest.endDate}`
    };
  }

  return { hasOverlap: false };
};

export const checkLeaveBalance = (employeeId: string, startDate: string, endDate: string): { hasBalance: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysRequested = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const balance = getLeaveBalance(employeeId);
  if (!balance) {
    return { hasBalance: false, error: 'Leave balance not found' };
  }

  if (balance.remainingDays < daysRequested) {
    return {
      hasBalance: false,
      error: `Insufficient leave balance. Requested: ${daysRequested} days, Available: ${balance.remainingDays} days`
    };
  }

  return { hasBalance: true };
};

export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};
