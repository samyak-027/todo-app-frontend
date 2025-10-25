import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Status, Task } from '../types';
import TaskColumn from './TaskColumn';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TasksPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const folder = searchParams.get('folder');
  const { tasks, updateTaskStatus, isLoading, error } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const tasksForDate = useMemo(() => {
    let filteredTasks = tasks.filter(task => task.date === date);
    if (folder) {
      filteredTasks = filteredTasks.filter(task => task.folder === folder);
    }
    return filteredTasks;
  }, [tasks, date, folder]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDrop = (newStatus: Status) => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, newStatus);
      setDraggedTaskId(null);
    }
  };

  const pendingTasks = useMemo(() => tasksForDate.filter(t => t.status === Status.Pending), [tasksForDate]);
  const inProgressTasks = useMemo(() => tasksForDate.filter(t => t.status === Status.InProgress), [tasksForDate]);
  const completedTasks = useMemo(() => tasksForDate.filter(t => t.status === Status.Completed), [tasksForDate]);
  
  if (isLoading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!date) {
    return <div className="text-center text-red-500">Date parameter is missing.</div>;
  }
  
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Tasks for</h2>
        <p className="mt-2 text-xl text-cyan-400">{formattedDate}</p>
        {folder && (
          <p className="mt-2 text-lg text-slate-400">
            in folder: <span className="font-semibold text-slate-300">"{folder}"</span>
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="Pending"
          status={Status.Pending}
          tasks={pendingTasks}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
        <TaskColumn
          title="In Progress"
          status={Status.InProgress}
          tasks={inProgressTasks}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
        <TaskColumn
          title="Completed"
          status={Status.Completed}
          tasks={completedTasks}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
};

export default TasksPage;