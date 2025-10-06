import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import Dashboard from "./pages/DashboardPage";
import WorklistPage from "./features/worklist/WorklistPage";
import ExamViewPage from "./features/exam-view/ExamViewPage";
import { UnifiedWorklistTable } from "./features/unified-worklist/UnifiedWorklistTable";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./layouts/SidebarLayout";
import Saisie from "./features/worklist/w2";
import Rapport from "./features/rapport/rapport";
import Patients from "./features/Patients/Patients";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/worklist" element={<WorklistPage />} />
            <Route path="/Patients" element={<Patients />} />
            <Route path="/Rapport" element={<Rapport />} />
            <Route path="/w2" element={<Saisie />} />
          </Route>
        </Route>

        {/* Catch-all redirects to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
