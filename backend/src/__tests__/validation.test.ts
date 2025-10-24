import { validateDateRange, checkOverlappingRequests, checkLeaveBalance, calculateLeaveDays } from '../utils/validation';
import { leaveRequests, leaveBalances } from '../data/mockData';

describe('Validation Utils', () => {
  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const result = validateDateRange(
        tomorrow.toISOString().split('T')[0],
        dayAfterTomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();

      const result = validateDateRange(
        yesterday.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start date cannot be in the past');
    });

    it('should reject invalid date format', () => {
      const result = validateDateRange('invalid-date', '2024-01-15');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid date format');
    });

    it('should reject end date before start date', () => {
      const result = validateDateRange('2024-01-15', '2024-01-10');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date cannot be before start date');
    });
  });

  describe('calculateLeaveDays', () => {
    it('should calculate correct number of days', () => {
      const days = calculateLeaveDays('2024-01-15', '2024-01-17');
      expect(days).toBe(3); // 15th, 16th, 17th
    });

    it('should calculate single day correctly', () => {
      const days = calculateLeaveDays('2024-01-15', '2024-01-15');
      expect(days).toBe(1);
    });
  });

  describe('checkLeaveBalance', () => {
    it('should pass when sufficient balance', () => {
      const result = checkLeaveBalance('1', '2024-01-15', '2024-01-17');
      expect(result.hasBalance).toBe(true);
    });

    it('should fail when insufficient balance', () => {
      // Create a request that exceeds the balance
      const result = checkLeaveBalance('1', '2024-01-15', '2024-02-15');
      expect(result.hasBalance).toBe(false);
      expect(result.error).toContain('Insufficient leave balance');
    });

    it('should fail when employee balance not found', () => {
      const result = checkLeaveBalance('nonexistent', '2024-01-15', '2024-01-17');
      expect(result.hasBalance).toBe(false);
      expect(result.error).toBe('Leave balance not found');
    });
  });

  describe('checkOverlappingRequests', () => {
    it('should detect overlapping requests', () => {
      const result = checkOverlappingRequests('1', '2024-01-16', '2024-01-18');
      expect(result.hasOverlap).toBe(true);
      expect(result.error).toContain('already have a leave request');
    });

    it('should not detect overlap for different employees', () => {
      const result = checkOverlappingRequests('3', '2024-01-15', '2024-01-17');
      expect(result.hasOverlap).toBe(false);
    });

    it('should not detect overlap for rejected requests', () => {
      // Add a rejected request for testing
      const rejectedRequest = {
        id: 'test-rejected',
        employeeId: '1',
        employeeName: 'John Doe',
        startDate: '2024-01-25',
        endDate: '2024-01-27',
        reason: 'Test',
        status: 'rejected' as const,
        appliedAt: '2024-01-10T10:00:00Z'
      };
      leaveRequests.push(rejectedRequest);

      const result = checkOverlappingRequests('1', '2024-01-25', '2024-01-27');
      expect(result.hasOverlap).toBe(false);

      // Clean up
      const index = leaveRequests.findIndex(req => req.id === 'test-rejected');
      leaveRequests.splice(index, 1);
    });
  });
});
