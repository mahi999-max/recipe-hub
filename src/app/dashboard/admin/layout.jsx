import Layout from '@/lib/DashboardSidebar';
import React from 'react';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Navigation */}
      <Layout></Layout>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}