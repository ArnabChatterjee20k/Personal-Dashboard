import React from "react";
import { ExternalLink, GitPullRequest, Calendar } from "lucide-react";

interface PR {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  state: string;
  repository?: {
    full_name?: string;
  };
}

interface PRCardProps {
  pr: PR;
}

export const PRCard: React.FC<PRCardProps> = ({ pr }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <GitPullRequest className="h-5 w-5 text-indigo-500 mr-2" />
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              pr.state === "open"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            }`}
          >
            {pr.state}
          </span>
        </div>
        <a
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <ExternalLink className="sm:h-4 sm:w-4" />
        </a>
      </div>

      <h3
        onClick={() => {
          const message = `Do you want to open this pull request?\n\n"${pr.title}"`;
          if (window.confirm(message)) {
            window.open(pr.html_url, "_blank");
          }
        }}
        
        className="mt-2 text-md font-medium text-gray-800 dark:text-white line-clamp-2 h-12 cursor-pointer hover:underline"
      >
        {pr.title}
      </h3>
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
        {pr.repository?.full_name || "Repository information not available"}
      </div>

      <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="h-3 w-3 mr-1" />
        {formatDate(pr.created_at)}
      </div>
    </div>
  );
};
