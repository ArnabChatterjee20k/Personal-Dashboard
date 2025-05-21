import React, { useEffect, useState } from 'react';
import { Hourglass, ExternalLink, CheckSquare, Film, BookOpen, Github } from 'lucide-react';
import { PRCard } from '../components/PRCard';
import { getTodos } from '../utils/todoStorage';
import { getMovies } from '../utils/movieStorage';
import { getProblems } from '../utils/problemStorage';

interface PR {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  state: string;
  repository: {
    full_name: string;
  };
}

export const Dashboard: React.FC = () => {
  const [pullRequests, setPullRequests] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    todos: 0,
    movies: 0,
    problems: 0
  });

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await fetch("https://api.github.com/search/issues?q=author:ArnabChatterjee20k+type:pr&per_page=6&page=1");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch PRs');
        }
        
        setPullRequests(data.items || []);
      } catch (err) {
        console.error('Error fetching PRs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch PRs');
      } finally {
        setLoading(false);
      }
    };

    // Get stats from local storage
    const todos = getTodos();
    const movies = getMovies();
    const problems = getProblems();
    
    setStats({
      todos: todos.length,
      movies: movies.length,
      problems: problems.length
    });

    fetchPRs();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <span>Dashboard Overview</span>
        </h2>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Github className="h-6 w-6" />
          <span>Recent Pull Requests</span>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Hourglass className="animate-spin h-8 w-8 text-indigo-500 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Loading PRs...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : pullRequests.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-600 dark:text-gray-400">
            No pull requests found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pullRequests.slice(0, 6).map(pr => (
              <PRCard key={pr.id} pr={pr} />
            ))}
          </div>
        )}
        
        <div className="mt-4 text-right">
          <a 
            href="https://github.com/ArnabChatterjee20k?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all repositories
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm transition-transform hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{count}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};