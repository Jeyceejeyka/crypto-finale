import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
    </div>
  );
};

export default Layout;