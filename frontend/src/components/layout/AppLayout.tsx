import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api';
import {useAppDispatch} from '../../hooks';
import { setAuthenticated } from '../../store/authSlice';

interface Props {
  children: React.ReactNode;
}

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/tasks', label: 'My Tasks' },
  { to: '/tasks/create', label: 'Create Task' },
  { to: '/analytics', label: 'Analytics & Reports' },
];

export const AppLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(setAuthenticated(false));
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-slate-100 hidden md:flex flex-col">
        <div className="px-6 py-4 text-xl font-semibold border-b border-slate-800">
          Task Manager
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="m-3 mb-4 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-slate-900 text-slate-100 px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">Task Manager</span>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

