import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LeaveApplicationForm from '../components/LeaveApplicationForm';

// Mock the API
jest.mock('../services/api', () => ({
  leaveAPI: {
    applyLeave: jest.fn(),
  },
}));

const MockedLeaveApplicationForm = () => (
  <BrowserRouter>
    <AuthProvider>
      <LeaveApplicationForm onClose={jest.fn()} onSuccess={jest.fn()} />
    </AuthProvider>
  </BrowserRouter>
);

describe('LeaveApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<MockedLeaveApplicationForm />);
    
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<MockedLeaveApplicationForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/end date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reason is required/i)).toBeInTheDocument();
    });
  });

  it('validates date constraints', async () => {
    const user = userEvent.setup();
    render(<MockedLeaveApplicationForm />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const reasonInput = screen.getByLabelText(/reason/i);
    const submitButton = screen.getByRole('button', { name: /submit request/i });

    // Set past date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await user.type(startDateInput, yesterday.toISOString().split('T')[0]);
    
    // Set future date for end date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await user.type(endDateInput, tomorrow.toISOString().split('T')[0]);
    
    // Set reason
    await user.type(reasonInput, 'This is a test reason for leave');
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/start date cannot be in the past/i)).toBeInTheDocument();
    });
  });

  it('validates reason length', async () => {
    const user = userEvent.setup();
    render(<MockedLeaveApplicationForm />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const reasonInput = screen.getByLabelText(/reason/i);
    const submitButton = screen.getByRole('button', { name: /submit request/i });

    // Set future dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    await user.type(startDateInput, tomorrow.toISOString().split('T')[0]);
    await user.type(endDateInput, dayAfterTomorrow.toISOString().split('T')[0]);
    
    // Set short reason
    await user.type(reasonInput, 'Short');
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/reason must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('calculates days correctly', async () => {
    const user = userEvent.setup();
    render(<MockedLeaveApplicationForm />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
    
    await user.type(startDateInput, tomorrow.toISOString().split('T')[0]);
    await user.type(endDateInput, dayAfterTomorrow.toISOString().split('T')[0]);

    await waitFor(() => {
      expect(screen.getByText(/total days requested: 3 days/i)).toBeInTheDocument();
    });
  });
});
