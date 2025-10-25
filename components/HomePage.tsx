import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { FolderIcon, PlusIcon, TrashIcon, SpinnerIcon } from './Icons';

const HomePage: React.FC = () => {
  const [taskTexts, setTaskTexts] = useState<string[]>(['']);
  const [folder, setFolder] = useState('');
  const { addTasks, isMutating } = useTasks();

  const handleTaskTextChange = (index: number, value: string) => {
    const newTexts = [...taskTexts];
    newTexts[index] = value;
    setTaskTexts(newTexts);
  };

  const handleAddTaskInput = () => {
    setTaskTexts([...taskTexts, '']);
  };

  const handleRemoveTaskInput = (index: number) => {
    if (taskTexts.length > 1) {
      const newTexts = taskTexts.filter((_, i) => i !== index);
      setTaskTexts(newTexts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textsToSubmit = taskTexts.map(t => t.trim()).filter(t => t);
    if (textsToSubmit.length > 0) {
      const success = await addTasks(textsToSubmit, folder.trim());
      if (success) {
        setTaskTexts(['']);
        setFolder('');
      }
    }
  };
  
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">What's on your mind?</h2>
        <p className="mt-2 text-lg text-slate-400">{dateString}</p>
      </div>
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-text-0" className="block text-sm font-medium text-slate-300 mb-2">
              New Tasks
            </label>
            <div className="space-y-3">
              {taskTexts.map((text, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    id={`task-text-${index}`}
                    type="text"
                    value={text}
                    onChange={(e) => handleTaskTextChange(index, e.target.value)}
                    placeholder={`Task #${index + 1}`}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    required={taskTexts.join("").trim().length > 0}
                    disabled={isMutating}
                  />
                  {taskTexts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTaskInput(index)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-slate-700 disabled:opacity-50"
                      aria-label="Remove task"
                      disabled={isMutating}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTaskInput}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
              disabled={isMutating}
            >
              <PlusIcon />
              Add another task
            </button>
          </div>
          <div>
            <label htmlFor="task-folder" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
              <FolderIcon />
              Folder (Optional)
            </label>
            <input
              id="task-folder"
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="e.g., Exam Prep, Travel Plans"
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
              disabled={isMutating}
            />
          </div>
          <button
            type="submit"
            disabled={isMutating || taskTexts.every(t => !t.trim())}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-transform duration-200 active:scale-95 disabled:bg-cyan-800 disabled:cursor-not-allowed"
          >
            {isMutating ? (
                <>
                    <SpinnerIcon className="h-5 w-5 animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    <PlusIcon/>
                    Add {taskTexts.filter(t=>t.trim()).length || 0} Task{taskTexts.filter(t=>t.trim()).length !== 1 ? 's' : ''}
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;