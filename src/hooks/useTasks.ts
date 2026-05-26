import { useState, useEffect, useCallback } from 'react';
import { API_URL, MESSAGES } from '../utils/constants';
import type { Task, TaskFormData, UseTasksReturn } from '../types';

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const apiRequest = useCallback(
    async (
      endpoint: string,
      method: string = 'GET',
      body?: unknown
    ) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    []
  );

  const handleSubmit = useCallback(
    async (callback: () => Promise<void>): Promise<boolean> => {
      setSubmitting(true);
      setError(null);

      try {
        await callback();
        return true;
      } catch (err) {
        setError(MESSAGES.ERROR_CONNECTION);
        console.error('Erro:', err);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const fetchTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data: Task[] = await apiRequest('');
      setTasks(data);
    } catch (err) {
      setError(MESSAGES.ERROR_LOAD);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const createTask = useCallback(
    async (taskData: TaskFormData): Promise<boolean> => {
      if (!taskData.title.trim()) {
        setError(MESSAGES.ERROR_EMPTY_TITLE);
        return false;
      }

      return handleSubmit(async () => {
        const newTask: Task = await apiRequest('', 'POST', {
          ...taskData,
          completed: false,
        });

        setTasks((prev) => [...prev, newTask]);
      });
    },
    [apiRequest, handleSubmit]
  );

  const updateTask = useCallback(
    async (
      id: number,
      taskData: TaskFormData
    ): Promise<boolean> => {
      if (!taskData.title.trim()) {
        setError(MESSAGES.ERROR_EMPTY_TITLE);
        return false;
      }

      return handleSubmit(async () => {
        const updatedTask: Task = await apiRequest(
          `/${id}`,
          'PUT',
          taskData
        );

        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? updatedTask : task
          )
        );
      });
    },
    [apiRequest, handleSubmit]
  );

  const toggleTask = useCallback(
    async (id: number): Promise<void> => {
      try {
        const updatedTask: Task = await apiRequest(
          `/${id}/toggle`,
          'PATCH'
        );

        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? updatedTask : task
          )
        );
      } catch (err) {
        setError(MESSAGES.ERROR_UPDATE);
        console.error('Erro:', err);
      }
    },
    [apiRequest]
  );

  const deleteTask = useCallback(
    async (id: number): Promise<void> => {
      try {
        await apiRequest(`/${id}`, 'DELETE');

        setTasks((prev) =>
          prev.filter((task) => task.id !== id)
        );
      } catch (err) {
        setError(MESSAGES.ERROR_DELETE);
        console.error('Erro:', err);
      }
    },
    [apiRequest]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    submitting,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    fetchTasks,
  };
}