import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
    credentials: 'include',
  }),
  tagTypes: ['Tasks', 'Stats'],
  endpoints: (builder) => ({
    login: builder.mutation<{ detail: string }, { email: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<{ detail: string }, { name: string; email: string; password: string; confirmPassword: string }>({
      query: ({ name, email, password, confirmPassword }) => ({
        url: 'auth/register',
        method: 'POST',
        body: {
          username: name,
          email,
          password,
          confirm_password: confirmPassword,
        },
      }),
    }),
    logout: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    fetchStats: builder.query<{ total: number; completed: number; pending: number; in_progress: number }, void>({
      query: () => 'tasks/stats',
      providesTags: ['Stats'],
    }),
    fetchTasks: builder.query<
      { results: Task[]; count: number },
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, search = '', status = 'all' }) => ({
        url: 'tasks/',
        params: { page, limit, search, status },
      }),
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: 'tasks/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks', 'Stats'],
    }),
    updateTask: builder.mutation<Task, { id: number } & Partial<Task>>({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tasks', 'Stats'],
    }),
    deleteTask: builder.mutation<{ detail?: string }, number>({
      query: (id) => ({
        url: `tasks/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks', 'Stats'],
    }),
    bulkCreateTasks: builder.mutation<{ created: Task[] }, { tasks: Partial<Task>[] }>({
      query: (body) => ({
        url: 'tasks/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks', 'Stats'],
    }),
    exportTasks: builder.mutation<Blob, { from?: string; to?: string; status?: string }>({
      query: (params) => ({
        url: 'tasks/export',
        method: 'GET',
        params,
        responseHandler: async (response) => await response.blob(),
      }),
    }),
  }),
});

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'in-progress';
  created_at: string;
}

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useFetchStatsQuery,
  useFetchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useBulkCreateTasksMutation,
  useExportTasksMutation,
} = api;

