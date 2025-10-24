import { Router, Request, Response } from 'express';
import { LeaveRequest, ApplyLeaveRequest, ApproveLeaveRequest, ApiResponse } from '../types';
import { leaveRequests, generateId, updateLeaveBalance } from '../data/mockData';
import { validateDateRange, checkOverlappingRequests, checkLeaveBalance, calculateLeaveDays } from '../utils/validation';
import { authenticateToken, requireManager } from '../middleware/auth';

const router = Router();

// Apply for leave
router.post('/apply', authenticateToken, (req: Request, res: Response) => {
  try {
    const { startDate, endDate, reason }: ApplyLeaveRequest = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!startDate || !endDate || !reason) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: startDate, endDate, reason'
      };
      res.status(400).json(response);
      return;
    }

    // Validate date range
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: dateValidation.error
      };
      res.status(400).json(response);
      return;
    }

    // Check for overlapping requests
    const overlapCheck = checkOverlappingRequests(userId, startDate, endDate);
    if (overlapCheck.hasOverlap) {
      const response: ApiResponse<null> = {
        success: false,
        error: overlapCheck.error
      };
      res.status(400).json(response);
      return;
    }

    // Check leave balance
    const balanceCheck = checkLeaveBalance(userId, startDate, endDate);
    if (!balanceCheck.hasBalance) {
      const response: ApiResponse<null> = {
        success: false,
        error: balanceCheck.error
      };
      res.status(400).json(response);
      return;
    }

    // Create new leave request
    const newRequest: LeaveRequest = {
      id: generateId(),
      employeeId: userId,
      employeeName: req.user!.name,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    leaveRequests.push(newRequest);

    const response: ApiResponse<LeaveRequest> = {
      success: true,
      data: newRequest,
      message: 'Leave request submitted successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get pending leave requests (Manager only)
router.get('/pending', authenticateToken, requireManager, (req: Request, res: Response) => {
  try {
    const pendingRequests = leaveRequests.filter(request => request.status === 'pending');
    
    const response: ApiResponse<LeaveRequest[]> = {
      success: true,
      data: pendingRequests
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Approve or reject leave request (Manager only)
router.post('/approve/:id', authenticateToken, requireManager, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments }: ApproveLeaveRequest = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Status must be either "approved" or "rejected"'
      };
      res.status(400).json(response);
      return;
    }

    const request = leaveRequests.find(req => req.id === id);
    if (!request) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Leave request not found'
      };
      res.status(404).json(response);
      return;
    }

    if (request.status !== 'pending') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Leave request has already been processed'
      };
      res.status(400).json(response);
      return;
    }

    // Update the request
    request.status = status;
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = req.user!.name;

    // If approved, update leave balance
    if (status === 'approved') {
      const daysUsed = calculateLeaveDays(request.startDate, request.endDate);
      updateLeaveBalance(request.employeeId, daysUsed);
    }

    const response: ApiResponse<LeaveRequest> = {
      success: true,
      data: request,
      message: `Leave request ${status} successfully`
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get leave summary (Bonus endpoint)
router.get('/summary', authenticateToken, requireManager, (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    
    let filteredRequests = leaveRequests;
    
    if (month && year) {
      const targetMonth = parseInt(month as string);
      const targetYear = parseInt(year as string);
      
      filteredRequests = leaveRequests.filter(request => {
        const requestDate = new Date(request.startDate);
        return requestDate.getMonth() + 1 === targetMonth && requestDate.getFullYear() === targetYear;
      });
    }

    // Group by employee
    const summary = filteredRequests.reduce((acc, request) => {
      const employeeId = request.employeeId;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          employeeName: request.employeeName,
          totalRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          pendingRequests: 0,
          totalDays: 0
        };
      }
      
      acc[employeeId].totalRequests++;
      acc[employeeId][`${request.status}Requests`]++;
      
      if (request.status === 'approved') {
        const days = calculateLeaveDays(request.startDate, request.endDate);
        acc[employeeId].totalDays += days;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const response: ApiResponse<any> = {
      success: true,
      data: Object.values(summary)
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get user's own leave requests
router.get('/my-requests', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRequests = leaveRequests.filter(request => request.employeeId === userId);
    
    const response: ApiResponse<LeaveRequest[]> = {
      success: true,
      data: userRequests
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

export default router;
