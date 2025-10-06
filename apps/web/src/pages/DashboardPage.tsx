import React from "react";

import Dashboard from "../pages/Dash";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {" "}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Tableau de Bord</h2>
        <p className="text-gray-600 mb-6">
          Welcome to the protected dashboard!
        </p>

        {/* Additional dashboard widgets */}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
