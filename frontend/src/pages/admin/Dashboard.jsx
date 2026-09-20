import React from 'react';
import { Users, Activity, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-zinc-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        <span>{trendValue}</span>
      </div>
      <span className="text-zinc-400 text-sm">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value="12,426"
          icon={Users}
          trend="up"
          trendValue="12.5%"
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Active Sessions"
          value="892"
          icon={Activity}
          trend="up"
          trendValue="5.2%"
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Monthly Revenue"
          value="$45,231"
          icon={CreditCard}
          trend="down"
          trendValue="2.4%"
          colorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Placeholder for a chart or recent activity */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-zinc-400">Activity Chart Placeholder</p>
      </div>
    </div>
  );
};

export default Dashboard;
