import React from 'react';
import { useFetchStatsQuery } from '../store/api';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useFetchStatsQuery();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>
      {isLoading && <p className="text-sm text-slate-500">Loading stats...</p>}
      {isError && (
        <p className="text-sm text-red-600">
          Failed to load stats. Please try again.
        </p>
      )}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Tasks
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {data.total}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {data.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Pending
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              {data.pending}
            </p>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <p className="text-sm text-slate-500">No stats available yet.</p>
      )}
    </div>
  );
};

