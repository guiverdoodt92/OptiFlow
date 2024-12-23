import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, Settings, LogOut } from 'lucide-react';
import { signOut } from '../../lib/auth';

export function DashboardLayout() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
              <Link to="/" className="text-white font-bold text-xl">OptiFlow</Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link
                  to="/dashboard"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LayoutDashboard className="mr-3 h-6 w-6" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/workflows"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  Workflows
                </Link>
                <Link
                  to="/dashboard/analytics"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <BarChart2 className="mr-3 h-6 w-6" />
                  Analytics
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Settings className="mr-3 h-6 w-6" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-3 h-6 w-6" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}