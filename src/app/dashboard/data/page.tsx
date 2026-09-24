'use client';

import { useState, useMemo, useEffect } from 'react';
import { antimicrobialRecords } from '@/data/mockData';
import { fetchRecords } from '@/lib/api';

export default function DataExplorerPage() {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [records, setRecords] = useState(antimicrobialRecords);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt fetching live records from FastAPI backend
    setLoading(true);
    fetchRecords({
      species: speciesFilter,
      drug_class: classFilter,
      status: statusFilter,
    }).then(res => {
      if (res.is_live && res.data && res.data.length > 0) {
        // Map backend schema (snake_case) to frontend schema (camelCase)
        const mapped = res.data.map((r: any) => ({
          id: r.id,
          drugName: r.drug_name || r.drugName,
          drugClass: r.drug_class || r.drugClass,
          species: r.species,
          speciesCategory: r.species_category || r.speciesCategory,
          route: r.route,
          indication: r.indication,
          dosageMgKg: r.dosage_mg_kg || r.dosageMgKg,
          durationDays: r.duration_days || r.durationDays,
          withdrawalPeriodDays: r.withdrawal_period_days !== undefined ? r.withdrawal_period_days : r.withdrawalPeriodDays,
          year: r.year,
          quarter: r.quarter,
          region: r.region,
          source: r.source,
          status: r.status,
        }));
        setRecords(mapped);
        setIsLiveApi(true);
      } else {
        setRecords(antimicrobialRecords);
        setIsLiveApi(false);
      }
      setLoading(false);
    });
  }, [speciesFilter, classFilter, statusFilter]);

  const species = useMemo(() => [
    'All', ...Array.from(new Set(antimicrobialRecords.map(r => r.species)))
  ], []);

  const drugClasses = useMemo(() => [
    'All', ...Array.from(new Set(antimicrobialRecords.map(r => r.drugClass)))
  ], []);

  const filtered = useMemo(() => {
    let data = records;
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(r =>
        r.drugName.toLowerCase().includes(s) ||
        r.species.toLowerCase().includes(s) ||
        r.indication.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s)
      );
    }
    if (!isLiveApi) {
      if (speciesFilter !== 'All') data = data.filter(r => r.species === speciesFilter);
      if (classFilter !== 'All') data = data.filter(r => r.drugClass === classFilter);
      if (statusFilter !== 'All') data = data.filter(r => r.status === statusFilter);
    }

    data = [...data].sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return data;
  }, [search, speciesFilter, classFilter, statusFilter, sortField, sortDir, records, isLiveApi]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span className="ml-1 text-gray-400">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header with Live Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Antimicrobial Data Explorer</h1>
            {isLiveApi ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live API: /api/data/records
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Cached FARAD Corpus
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">Browse, filter, and inspect antimicrobial records across food and companion species</p>
        </div>
      </div>

      {/* Filters */}
      <div className="chart-card">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search Records</label>
            <input
              type="text"
              placeholder="Search drug, species, disease..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Species</label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {species.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Drug Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {drugClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prescription Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Extra-Label">Extra-Label</option>
              <option value="Prohibited">Prohibited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> records
          {loading && <span className="ml-2 text-xs text-blue-600 font-medium">Refreshing...</span>}
        </p>
        <button
          onClick={() => { setSearch(''); setSpeciesFilter('All'); setClassFilter('All'); setStatusFilter('All'); }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="chart-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('id')}>
                  ID <SortIcon field="id" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('drugName')}>
                  Drug <SortIcon field="drugName" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('drugClass')}>
                  Class <SortIcon field="drugClass" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('species')}>
                  Species <SortIcon field="species" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Indication</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('dosageMgKg')}>
                  Dose (mg/kg) <SortIcon field="dosageMgKg" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort('withdrawalPeriodDays')}>
                  Withdrawal <SortIcon field="withdrawalPeriodDays" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Source</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{record.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{record.drugName}</td>
                  <td className="px-4 py-3 text-gray-600">{record.drugClass}</td>
                  <td className="px-4 py-3 text-gray-700">{record.species}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{record.route}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{record.indication}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{record.dosageMgKg}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-gray-900">
                    {record.withdrawalPeriodDays > 0 ? `${record.withdrawalPeriodDays} d` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">Q{record.quarter} {record.year}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{record.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${
                      record.status === 'Approved' ? 'badge-approved' :
                      record.status === 'Extra-Label' ? 'badge-extra-label' :
                      'badge-prohibited'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
