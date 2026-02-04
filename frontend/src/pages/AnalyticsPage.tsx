import React, { useState } from 'react';
import { useExportTasksMutation, useFetchStatsQuery } from '../store/api';

export const AnalyticsPage: React.FC = () => {
  const { data } = useFetchStatsQuery();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('all');
  const [exportTasks, { isLoading }] = useExportTasksMutation();

  const handleExport = async () => {
    const blob = await exportTasks({ from, to, status }).unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks_export.xls';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Analytics &amp; Reports
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 space-y-4 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Task Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60"
        >
          {isLoading ? 'Downloading...' : 'Download Excel'}
        </button>
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow-sm p-5 max-w-xl">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Summary
          </h2>
          <dl className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <dt>Total tasks</dt>
              <dd className="font-semibold">{data.total}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Completed tasks</dt>
              <dd className="font-semibold text-emerald-600">
                {data.completed}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Pending tasks</dt>
              <dd className="font-semibold text-amber-500">
                {data.pending}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

