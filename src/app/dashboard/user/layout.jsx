import Layout from '@/lib/DashboardSidebar';
import React from 'react';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Navigation */}
      <Layout></Layout>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}