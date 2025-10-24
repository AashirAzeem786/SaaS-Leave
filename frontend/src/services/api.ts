import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  ApplyLeaveRequest, 
  ApproveLeaveRequest, 
  LeaveRequest, 
  LeaveSummary, 
  ApiResponse, 
  User 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const leaveAPI = {
  applyLeave: async (leaveData: ApplyLeaveRequest): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.post('/leave/apply', leaveData);
    return response.data;
  },

  getPendingRequests: async (): Promise<ApiResponse<LeaveRequest[]>> => {
    const response = await api.get('/leave/pending');
    return response.data;
  },

  approveLeave: async (id: string, approvalData: ApproveLeaveRequest): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.post(`/leave/approve/${id}`, approvalData);
    return response.data;
  },

  getMyRequests: async (): Promise<ApiResponse<LeaveRequest[]>> => {
    const response = await api.get('/leave/my-requests');
    return response.data;
  },

  getLeaveSummary: async (month?: number, year?: number): Promise<ApiResponse<LeaveSummary[]>> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`/leave/summary?${params.toString()}`);
    return response.data;
  },
};

export default api;
