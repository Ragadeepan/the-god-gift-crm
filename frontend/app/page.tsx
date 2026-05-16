"use client";

import { useCallback } from "react";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import CustomerForm from "@/components/CustomerForm";
import CustomerTable from "@/components/CustomerTable";
import RecentCustomers from "@/components/RecentCustomers";
import { useCustomers, useStats } from "@/hooks/useCustomers";

export default function DashboardPage() {
  const { customers, loading, search, setSearch, pagination, refresh } =
    useCustomers();
  const { stats, loading: statsLoading, refresh: refreshStats } = useStats();

  const handleSaved = useCallback(() => {
    refresh();
    refreshStats();
  }, [refresh, refreshStats]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page heading */}
        <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Customer{" "}
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your customer leads in one place
          </p>
        </div>

        {/* Stats row */}
        <div className="animate-slide-up">
          <StatsCards stats={stats} loading={statsLoading} />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
          {/* Left column — form + recent */}
          <div className="xl:col-span-1 space-y-6">
            <CustomerForm onSaved={handleSaved} />
            <RecentCustomers
              customers={stats?.recentCustomers ?? []}
              loading={statsLoading}
            />
          </div>

          {/* Right column — customer table */}
          <div className="xl:col-span-2">
            <CustomerTable
              customers={customers}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              total={pagination.total}
              onRefresh={refresh}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            The God Gift CRM &copy; {new Date().getFullYear()} — Built with
            Next.js &amp; Express
          </p>
        </div>
      </footer>
    </div>
  );
}
