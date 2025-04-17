
import React from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
