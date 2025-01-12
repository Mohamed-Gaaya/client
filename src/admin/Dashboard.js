import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardContent from "./components/DashboardContent";

function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="p-4 bg-gray-100 flex-1">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
