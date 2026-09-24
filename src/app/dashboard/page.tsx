'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  dashboardStats, usageTrends, drugClassDistribution,
  speciesBreakdown, regionalData
} from '@/data/mockData';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6b7280'];

export default function DashboardPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>(['cattle', 'swine', 'poultry']);

  const stats = [
    { label: 'Total Records', value: dashboardStats.totalRecords.toLocaleString(), change: '+12.3%', positive: true, icon: '📊' },
    { label: 'Unique Drugs', value: dashboardStats.uniqueDrugs.toString(), change: '+3', positive: true, icon: '💊' },
    { label: 'Species Covered', value: dashboardStats.speciesCovered.toString(), change: '+2', positive: true, icon: '🐾' },
    { label: 'Data Sources', value: dashboardStats.dataSources.toString(), change: 'Active', positive: true, icon: '🔗' },
    { label: 'Avg Withdrawal (days)', value: dashboardStats.avgWithdrawalDays.toString(), change: '-1.2', positive: true, icon: '⏱️' },
    { label: 'Extra-Label Use', value: `${dashboardStats.extraLabelPercentage}%`, change: '+2.1%', positive: false, icon: '⚠️' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview (Minimal Version)</h1>
        <p className="text-gray-500 mt-1">Antimicrobial usage surveillance research prototype: analytics across monitored species and regions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium ${
                stat.positive ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage Trends - Area Chart */}
        <div className="chart-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Antimicrobial Usage Trends</h3>
              <p className="text-sm text-gray-500">Quarterly usage by species category (2022-2024)</p>
            </div>
            <div className="flex gap-2">
              {['cattle', 'swine', 'poultry'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecies(prev =>
                    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                  )}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedSpecies.includes(s)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={usageTrends}>
              <defs>
                <linearGradient id="colorCattle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSwine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPoultry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              {selectedSpecies.includes('cattle') && (
                <Area type="monotone" dataKey="cattle" stroke="#3b82f6" fill="url(#colorCattle)" strokeWidth={2} name="Cattle" />
              )}
              {selectedSpecies.includes('swine') && (
                <Area type="monotone" dataKey="swine" stroke="#22c55e" fill="url(#colorSwine)" strokeWidth={2} name="Swine" />
              )}
              {selectedSpecies.includes('poultry') && (
                <Area type="monotone" dataKey="poultry" stroke="#f59e0b" fill="url(#colorPoultry)" strokeWidth={2} name="Poultry" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Drug Class Distribution - Pie Chart */}
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Drug Class Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">By percentage of total usage</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={drugClassDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="drugClass"
              >
                {drugClassDistribution.map((entry, index) => (
                  <Cell key={entry.drugClass} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} records`, name]}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {drugClassDistribution.slice(0, 5).map((item, i) => (
              <div key={item.drugClass} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{item.drugClass}</span>
                </div>
                <span className="font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Species Breakdown - Bar Chart */}
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Records by Species</h3>
          <p className="text-sm text-gray-500 mb-6">Total antimicrobial records per species</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={speciesBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="species" tick={{ fontSize: 11 }} stroke="#94a3b8" width={120} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`${value} records`]}
              />
              <Bar dataKey="totalRecords" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20}>
                {speciesBreakdown.map((entry, index) => {
                  const colorMap: Record<string, string> = {
                    'Major Livestock': '#3b82f6',
                    'Poultry': '#f59e0b',
                    'Companion Animals': '#8b5cf6',
                    'Minor Species': '#22c55e',
                  };
                  return <Cell key={entry.species} fill={colorMap[entry.category] || '#6b7280'} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional & Companion Animals */}
        <div className="space-y-6">
          {/* Regional Data */}
          <div className="chart-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Regional Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">Antimicrobial usage by US region</p>
            <div className="space-y-3">
              {regionalData.map((region) => {
                const maxUsage = Math.max(...regionalData.map(r => r.totalUsage));
                const percentage = (region.totalUsage / maxUsage) * 100;
                return (
                  <div key={region.region}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{region.region}</span>
                      <span className="text-gray-500">{region.totalUsage.toLocaleString()} records</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-gray-400">Top Drug: {region.topDrug}</span>
                      <span className="text-xs text-gray-400">Top Species: {region.topSpecies}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Companion Animals Trend */}
          <div className="chart-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Companion Animal Trends</h3>
            <p className="text-sm text-gray-500 mb-4">AIM 2: Dogs, Cats & Horses</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={usageTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="dogs" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} name="Dogs" />
                <Area type="monotone" dataKey="cats" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} strokeWidth={2} name="Cats" />
                <Area type="monotone" dataKey="horses" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} name="Horses" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
