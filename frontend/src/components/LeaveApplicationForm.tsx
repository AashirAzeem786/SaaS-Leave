import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { leaveAPI } from '../services/api';

interface LeaveApplicationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  startDate: string;
  endDate: string;
  reason: string;
}

const schema = yup.object({
  startDate: yup
    .string()
    .required('Start date is required')
    .test('not-past', 'Start date cannot be in the past', function(value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),
  endDate: yup
    .string()
    .required('End date is required')
    .test('not-before-start', 'End date cannot be before start date', function(value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return false;
      return new Date(value) >= new Date(startDate);
    }),
  reason: yup
    .string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters')
});

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await leaveAPI.applyLeave(data);
      
      if (response.success) {
        toast.success('Leave request submitted successfully!');
        onSuccess();
      } else {
        toast.error(response.error || 'Failed to submit leave request');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit leave request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Apply for Leave</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('startDate')}
                type="date"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.startDate ? 'border-danger-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('endDate')}
                type="date"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.endDate ? 'border-danger-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.endDate.message}</p>
            )}
          </div>

          {startDate && endDate && calculateDays() > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <p className="text-sm text-primary-800">
                <strong>Total days requested:</strong> {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                {...register('reason')}
                rows={4}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                  errors.reason ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </div>
            {errors.reason && (
              <p className="mt-1 text-sm text-danger-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;
