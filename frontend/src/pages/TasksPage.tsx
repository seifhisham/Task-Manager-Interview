import React, { useMemo, useState } from 'react';
import {
  Task,
  useDeleteTaskMutation,
  useFetchTasksQuery,
} from '../store/api';

export const TasksPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTask] = useDeleteTaskMutation();

  const { data, isLoading, isError, refetch } = useFetchTasksQuery({
    page,
    limit: 10,
    status,
    search: debouncedSearch,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.count / 10));
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    // simple debounce with timeout
    window.clearTimeout((handleSearchChange as any)._t);
    (handleSearchChange as any)._t = window.setTimeout(
      () => setDebouncedSearch(value),
      400
    );
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await deleteTask(task.id).unwrap();
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">My Tasks</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by title..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-600">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600">
                  Description
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-600">
                  Created At
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm">
                    Loading tasks...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-red-600">
                    Failed to load tasks.
                  </td>
                </tr>
              )}
              {!isLoading && data && data.results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    No tasks found.
                  </td>
                </tr>
              )}
              {data?.results.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {task.description || '-'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : task.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right space-x-3">
                    {/* For brevity, inline delete only; edit could open modal or navigate */}
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => handleDelete(task)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && data.results.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded border border-slate-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded border border-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

