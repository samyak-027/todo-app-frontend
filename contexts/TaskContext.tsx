import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, Status } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/tasks';

interface TaskContextType {
  tasks: Task[];
  addTasks: (texts: string[], folder?: string) => Promise<boolean>;
  updateTaskStatus: (taskId: string, newStatus: Status) => Promise<void>;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks from the server.');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      let message = 'An unknown error occurred.';
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
          message = `Could not connect to the backend at ${API_BASE_URL}. Please ensure the server is running.`;
      } else if (err instanceof Error) {
          message = err.message;
      }
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTasks = useCallback(async (texts: string[], folder?: string): Promise<boolean> => {
    setIsMutating(true);
    setError(null);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const newTasksPayload = texts.map(text => ({
      text,
      status: Status.Pending,
      date: dateString,
      folder: folder || undefined,
    }));

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTasksPayload),
      });
      if (!response.ok) {
        throw new Error('Failed to add tasks.');
      }
      await fetchTasks();
      return true; // Success
    } catch (err) {
      let message = 'Failed to add tasks.';
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
          message = `Could not connect to the backend. Please ensure the server is running.`;
      } else if (err instanceof Error) {
          message = err.message;
      }
      setError(message);
      console.error('Error adding tasks:', err);
      return false; // Failure
    } finally {
        setIsMutating(false);
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: Status) => {
    const originalTasks = tasks;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
       if (!response.ok) {
        throw new Error('Failed to update task status on the server.');
      }
    } catch (err) {
       setTasks(originalTasks);
       let message = 'Failed to update task.';
       if (err instanceof TypeError && err.message === 'Failed to fetch') {
         message = `Could not connect to the backend. Please ensure the server is running.`;
       } else if (err instanceof Error) {
         message = err.message;
       }
       setError(message);
       console.error('Error updating task status:', err);
    }
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, addTasks, updateTaskStatus, isLoading, isMutating, error }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};