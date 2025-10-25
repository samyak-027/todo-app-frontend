import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import TasksPage from './components/TasksPage';
import FolderHistoryPage from './components/FolderHistoryPage';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-300 selection:text-cyan-900">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:folderName" element={<FolderHistoryPage />} />
              <Route path="/tasks/:date" element={<TasksPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </TaskProvider>
  );
};

export default App;