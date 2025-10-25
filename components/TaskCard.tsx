import React from 'react';
import { Task } from '../types';
import { FolderIcon, PencilIcon, TrashIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onEdit, onDelete }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group bg-slate-900 p-4 rounded-md border border-slate-700 cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-lg hover:shadow-cyan-500/10 relative"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700"
          aria-label="Edit task"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-slate-700"
          aria-label="Delete task"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <p className="text-slate-200 pr-16">{task.text}</p>
      {task.folder && (
        <div className="mt-2 flex items-center gap-2">
          <FolderIcon className="h-4 w-4 text-slate-500" />
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{task.folder}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
