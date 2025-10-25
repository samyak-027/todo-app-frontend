import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';
import { FolderIcon, TaskListIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';


interface GroupedTasks {
  [date: string]: Task[];
}

const HistoryPage: React.FC = () => {
  const { tasks, isLoading, error } = useTasks();

  const allFolders = useMemo(() => {
    const folderSet = new Set<string>();
    tasks.forEach(task => {
        if (task.folder) {
            folderSet.add(task.folder);
        }
    });
    return Array.from(folderSet).sort();
  }, [tasks]);

  const groupedTasks = useMemo(() => tasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as GroupedTasks), [tasks]);

  const sortedDates = useMemo(() => Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [groupedTasks]);

  if (isLoading) {
    return <LoadingSpinner message="Fetching task history..." />;
  }

  if (error) {
      return <ErrorMessage message={error} />
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <TaskListIcon className="mx-auto h-12 w-12 text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-white">No tasks yet</h3>
        <p className="mt-1 text-slate-400">Add a task on the main page to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Task History</h2>
        <p className="mt-2 text-lg text-slate-400">Review your accomplishments day by day.</p>
      </div>
      
      {allFolders.length > 0 && (
        <div className="mb-8 p-4 sm:p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <FolderIcon />
                Filter by Folder
            </h3>
            <div className="flex flex-wrap gap-3">
                {allFolders.map(folder => (
                    <Link
                        key={folder}
                        to={`/history/${encodeURIComponent(folder)}`}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-1.5 px-3 rounded-full text-sm transition-colors"
                    >
                        {folder}
                    </Link>
                ))}
            </div>
        </div>
      )}

      {sortedDates.length === 0 ? (
         <div className="text-center py-16">
          <TaskListIcon className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-white">No tasks found</h3>
          <p className="mt-1 text-slate-400">There are no tasks in the general history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => {
            const tasksForDate = groupedTasks[date];
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const folders = [...new Set(tasksForDate.map(t => t.folder).filter(Boolean))];

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
                        to={`/tasks/${date}`}
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
                    {folders.length > 0 && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-slate-400">
                        <FolderIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {folders.map(folder => (
                            <span key={folder} className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-full">{folder}</span>
                          ))}
                        </div>
                      </div>
                    )}
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

export default HistoryPage;