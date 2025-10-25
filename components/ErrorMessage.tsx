import React from 'react';
import { ErrorIcon } from './Icons';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="my-8 p-6 bg-rose-900/20 border border-rose-800 rounded-lg" role="alert">
        <div className="flex items-center">
            <ErrorIcon className="h-8 w-8 text-rose-500 flex-shrink-0" />
            <div className="ml-4">
                <h3 className="text-lg font-bold text-white">An Error Occurred</h3>
                <p className="mt-1 text-rose-300">{message}</p>
            </div>
        </div>
    </div>
);

export default ErrorMessage;
