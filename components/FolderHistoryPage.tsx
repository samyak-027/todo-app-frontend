import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';
import { FolderIcon, TaskListIcon, ArrowLeftIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface GroupedTasks {
  [date: string]: Task[];
}

const FolderHistoryPage: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const { tasks, isLoading, error } = useTasks();
  const navigate = useNavigate();
  const decodedFolderName = folderName ? decodeURIComponent(folderName) : '';

  const tasksForFolder = tasks.filter(task => task.folder === decodedFolderName);

  const groupedTasks = tasksForFolder.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as GroupedTasks);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (isLoading) {
    return <LoadingSpinner message={`Fetching history for "${decodedFolderName}"...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!decodedFolderName) {
    return <div className="text-center text-red-500">Folder name is missing.</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative text-center mb-8">
         <button 
            onClick={() => navigate('/history')} 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-800"
            aria-label="Back to history"
        >
             <ArrowLeftIcon/> 
             <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          History for <span className="text-cyan-400">"{decodedFolderName}"</span>
        </h2>
        <p className="mt-2 text-lg text-slate-400">All tasks filed under this folder.</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-16">
          <TaskListIcon className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-white">No tasks found</h3>
          <p className="mt-1 text-slate-400">There are no tasks in the "{decodedFolderName}" folder yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => {
            const tasksForDate = groupedTasks[date];
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

            return (
              <div key={date} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">{formattedDate}</p>
                      <p className="text-sm text-cyan-400">{formattedDay}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Link
                        to={`/tasks/${date}?folder=${encodeURIComponent(decodedFolderName)}`}
                        className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        View Tasks
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-700 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <TaskListIcon className="h-5 w-5" />
                      <span>{tasksForDate.length} task{tasksForDate.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FolderHistoryPage;