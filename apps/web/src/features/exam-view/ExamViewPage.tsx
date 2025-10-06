import React from 'react';
import { useParams } from 'react-router-dom';
import { useExamDetails } from '../../hooks/useExamDetails'; // Import the custom hook

const ExamViewPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { examDetails, loading, error } = useExamDetails(examId); // Use the custom hook

  if (loading) {
    return <div>Loading exam details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!examDetails) {
    return <div>No exam details found.</div>;
  }

  return (
    <div>
      <h2>Exam Details for {examDetails.exam_id}</h2>
      <p><strong>Patient Name:</strong> {examDetails.patient_name}</p>
      <p><strong>Patient ID:</strong> {examDetails.patient_id}</p>
      <p><strong>Exam Date:</strong> {examDetails.exam_date}</p>
      <p><strong>Exam Type:</strong> {examDetails.exam_type}</p>
    </div>
  );
};

export default ExamViewPage;