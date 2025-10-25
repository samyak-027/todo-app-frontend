
import React from 'react';
import { Task } from '../types';
import { FolderIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-slate-900 p-4 rounded-md border border-slate-700 cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <p className="text-slate-200">{task.text}</p>
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
