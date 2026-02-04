import React, { useState } from 'react';
import {
  useBulkCreateTasksMutation,
  useCreateTaskMutation,
} from '../store/api';

type TaskStatus = 'pending' | 'completed' | 'in-progress';

export const CreateTaskPage: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [rows, setRows] = useState<
    { title: string; description: string; status: TaskStatus }[]
  >([{ title: '', description: '', status: 'pending' }]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [bulkCreate, { isLoading: isBulkCreating }] =
    useBulkCreateTasksMutation();

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title) {
      setError('Title is required.');
      return;
    }
    await createTask({ title, description, status }).unwrap();
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  const handleBulkJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validRows = rows.filter((r) => r.title.trim() !== '');
    if (validRows.length === 0) {
      setError('Add at least one task with a title.');
      return;
    }
    await bulkCreate({ tasks: validRows }).unwrap();
    setRows([{ title: '', description: '', status: 'pending' }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleBulkFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Choose a CSV file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await fetch('http://localhost:8000/tasks/bulk', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    setFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Create Task
      </h1>
      <div className="mb-4 flex gap-3 text-sm">
        <button
          className={`px-3 py-1.5 rounded-md border ${
            mode === 'single'
              ? 'bg-sky-600 border-sky-600 text-white'
              : 'border-slate-300 text-slate-700'
          }`}
          onClick={() => setMode('single')}
        >
          Single Task
        </button>
        <button
          className={`px-3 py-1.5 rounded-md border ${
            mode === 'bulk'
              ? 'bg-sky-600 border-sky-600 text-white'
              : 'border-slate-300 text-slate-700'
          }`}
          onClick={() => setMode('bulk')}
        >
          Bulk Tasks
        </button>
      </div>
      {error && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {mode === 'single' ? (
        <form
          onSubmit={handleSingleSubmit}
          className="bg-white rounded-xl shadow-sm p-5 space-y-4 max-w-xl"
        >
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TaskStatus)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5"
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <form
            onSubmit={handleBulkJsonSubmit}
            className="bg-white rounded-xl shadow-sm p-5 space-y-3"
          >
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
              Option A – Dynamic Table
            </h2>
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                >
                  <input
                    placeholder="Title"
                    value={row.title}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[idx].title = e.target.value;
                      setRows(copy);
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[idx].description = e.target.value;
                      setRows(copy);
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={row.status}
                      onChange={(e) => {
                        const copy = [...rows];
                        copy[idx].status = e.target.value as TaskStatus;
                        setRows(copy);
                      }}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm flex-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() =>
                        setRows((prev) =>
                          prev.length === 1
                            ? prev
                            : prev.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() =>
                  setRows((prev) => [
                    ...prev,
                    { title: '', description: '', status: 'pending' },
                  ])
                }
                className="text-xs font-medium text-sky-700"
              >
                + Add Row
              </button>
              <button
                type="submit"
                disabled={isBulkCreating}
                className="rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-4 py-2"
              >
                {isBulkCreating ? 'Creating...' : 'Create All'}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleBulkFileSubmit}
            className="bg-white rounded-xl shadow-sm p-5 space-y-3"
          >
            <h2 className="text-sm font-semibold text-slate-800 mb-1">
              Option B – CSV Upload
            </h2>
            <p className="text-xs text-slate-500">
              CSV headers: <code>title, description, status</code>
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-4 py-2"
            >
              Upload CSV
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

