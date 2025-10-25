
import React, { useState } from 'react';
import { Status, Task } from '../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onDrop: (status: Status) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const statusConfig = {
    [Status.Pending]: {
        color: 'border-l-rose-500',
        titleColor: 'text-rose-400'
    },
    [Status.InProgress]: {
        color: 'border-l-amber-500',
        titleColor: 'text-amber-400'
    },
    [Status.Completed]: {
        color: 'border-l-emerald-500',
        titleColor: 'text-emerald-400'
    }
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDrop, onDragStart }) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggedOver(false);
    }
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop(status);
        setIsDraggedOver(false);
    };

    const config = statusConfig[status];

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 transition-all duration-300 ${isDraggedOver ? 'bg-slate-700/70' : ''}`}
        >
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${config.titleColor}`}>
                <span className={`w-2 h-2 rounded-full ${config.color.replace('border-l-','bg-')}`}></span>
                {title}
                <span className="text-sm font-normal bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">{tasks.length}</span>
            </h3>
            <div className="space-y-3 min-h-[100px]">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
                    ))
                ) : (
                    <div className="text-center text-slate-500 pt-8 text-sm">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;
