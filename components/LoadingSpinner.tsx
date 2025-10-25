import React from 'react';
import { SpinnerIcon } from './Icons';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => (
    <div className="flex justify-center items-center py-16" aria-live="polite">
        <div className="text-center">
            <SpinnerIcon className="mx-auto h-12 w-12 text-slate-500 animate-spin" />
            <h3 className="mt-4 text-lg font-medium text-white">{message}</h3>
        </div>
    </div>
);

export default LoadingSpinner;
