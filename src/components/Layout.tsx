import React from 'react';
import { LayoutGrid, Github, Moon, Sun, GitPullRequest } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

type TabType = 'dashboard' | 'pull-requests';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-indigo-600 dark:bg-indigo-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Github className="h-6 w-6" />
            Personal Dashboard
          </h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-6">
        <nav className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <TabButton 
              isActive={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutGrid className="w-5 h-5 mr-2" />}
              label="Dashboard"
            />
            <TabButton 
              isActive={activeTab === 'pull-requests'} 
              onClick={() => setActiveTab('pull-requests')}
              icon={<GitPullRequest className="w-5 h-5 mr-2" />}
              label="Pull Requests"
            />
          </ul>
        </nav>
        
        <main className="pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <li className="mr-2">
      <button
        onClick={onClick}
        className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
          isActive 
            ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 active' 
            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
        } transition-all duration-200`}
      >
        {icon}
        {label}
      </button>
    </li>
  );
};