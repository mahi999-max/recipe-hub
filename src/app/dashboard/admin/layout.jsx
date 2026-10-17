import Layout from '@/lib/DashboardSidebar';
// import DashboardSidebar from '@/lib/DashboardSidebar';
import React from 'react';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Navigation */}
      <Layout></Layout>
      {/* <DashboardSidebar></DashboardSidebar> */}
      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}