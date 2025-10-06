import { useState, useEffect } from 'react';
import api from '../lib/api'; // Adjust path as needed
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError

interface ExamDetails {
  exam_id: string;
  patient_id: string;
  exam_date: string;
  exam_type: string;
  patient_name: string;
}

interface UseExamDetailsResult {
  examDetails: ExamDetails | null;
  loading: boolean;
  error: string | null;
}

export const useExamDetails = (examId: string | undefined): UseExamDetailsResult => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!examId) {
        setError('No exam ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/exams/${examId}`);
        setExamDetails(response.data);
      } catch (err: unknown) {
        let errorMessage = 'Failed to load exam details.';
        if (axios.isAxiosError(err) && err.response) {
          errorMessage = err.response.data?.message || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error('Failed to fetch exam details:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [examId]);

  return { examDetails, loading, error };
};