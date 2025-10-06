import React from "react";
import { Outlet } from "react-router-dom";
import SimpleSidebar from "../components/SimpleSidebar";

const SidebarLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full">
      <SimpleSidebar /> {/* Sidebar always visible */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet /> {/* Render the child route here */}
      </main>
    </div>
  );
};

export default SidebarLayout;
