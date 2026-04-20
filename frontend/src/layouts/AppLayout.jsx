import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function AppLayout({ isAuthenticated, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        topOffsetClass="top-0"
        desktopWidthClass="lg:w-64"
        heightClass="h-screen"
        showBrand
        logoutLabel="Logout"
      />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64">
        <TopBar user={user} onLogout={onLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
