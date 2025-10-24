import { Router, Request, Response } from 'express';
import { LoginRequest, LoginResponse, ApiResponse } from '../types';
import { findUserByCredentials } from '../data/mockData';

const router = Router();

// Login endpoint
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Username and password are required'
      };
      res.status(400).json(response);
      return;
    }

    const user = findUserByCredentials(username, password);
    
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid credentials'
      };
      res.status(401).json(response);
      return;
    }

    // In a real app, you'd generate a JWT token here
    // For this mock implementation, we'll use the user ID as the token
    const token = user.id;

    const loginResponse: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email
        },
        token
      },
      message: 'Login successful'
    };

    res.json(loginResponse);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get current user info
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    // In a real app, you'd verify the JWT token here
    const { findUserById } = require('../data/mockData');
    const user = findUserById(token);
    
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid token'
      };
      res.status(403).json(response);
      return;
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email
      }
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
