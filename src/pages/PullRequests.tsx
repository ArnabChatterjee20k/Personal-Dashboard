import React, { useState, useEffect } from "react";
import { GitPullRequest, Search, Hourglass, XCircle } from "lucide-react";
import { PRCard } from "../components/PRCard";

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

const PER_PAGE = 6;

export const PullRequests: React.FC = () => {
  const [prPages, setPrPages] = useState<{ [page: number]: PR[] }>({});
  const [loadingPages, setLoadingPages] = useState<{ [page: number]: boolean }>(
    {}
  );
  const [_, setErrorPages] = useState<{ [page: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ [term: string]: PR[] }>(
    {}
  );
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "repo">("newest");

  const fetchPRPage = async (page: number) => {
    if (prPages[page] || loadingPages[page]) return;

    setLoadingPages((prev) => ({ ...prev, [page]: true }));
    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=author:ArnabChatterjee20k+type:pr&per_page=${PER_PAGE}&page=${page}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch PRs");

      setPrPages((prev) => ({ ...prev, [page]: data.items || [] }));
    } catch (err: any) {
      setErrorPages((prev) => ({
        ...prev,
        [page]: err.message || "Failed to fetch PRs",
      }));
    } finally {
      setLoadingPages((prev) => ({ ...prev, [page]: false }));
    }
  };

  const fetchSearchResults = async (term: string) => {
    if (searchResults[term]) {
      setActiveSearch(term);
      return;
    }

    setLoadingSearch(true);
    setErrorSearch(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=author:ArnabChatterjee20k+type:pr+${encodeURIComponent(
          term
        )}&per_page=100`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Search failed");

      setSearchResults((prev) => ({ ...prev, [term]: data.items || [] }));
      setActiveSearch(term);
    } catch (err: any) {
      setErrorSearch(err.message || "Search failed");
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    fetchPRPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (prPages[currentPage]) {
      fetchPRPage(currentPage + 1);
    }
  }, [prPages, currentPage]);

  const allPRs = Object.values(prPages).flat();

  const getFilteredAndSorted = (prs: PR[]) =>
    prs
      .filter((pr) => statusFilter === "all" || pr.state === statusFilter)
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } else if (sortBy === "oldest") {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        } else {
          const repoA = a.repository?.full_name || "";
          const repoB = b.repository?.full_name || "";
          return repoA.localeCompare(repoB);
        }
      });

  const displayedPRs = activeSearch
    ? getFilteredAndSorted(searchResults[activeSearch] || [])
    : getFilteredAndSorted(prPages[currentPage] || []);

  const totalPRs = allPRs.length;
  const openPRs = allPRs.filter((pr) => pr.state === "open").length;
  const closedPRs = allPRs.filter((pr) => pr.state === "closed").length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
        <GitPullRequest className="h-6 w-6" /> Pull Requests
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Total PRs"
          value={totalPRs}
          color="text-gray-900 dark:text-white"
        />
        <StatCard
          label="Open PRs"
          value={openPRs}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Closed PRs"
          value={closedPRs}
          color="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchInput.trim()) {
                fetchSearchResults(searchInput);
              }
            }}
            placeholder="Search pull requests..."
            className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
          {/* Show "Old data" message when input changed but not searched */}
          {searchInput.trim() && searchInput !== activeSearch && (
            <p className="absolute right-3 top-full mt-1 text-yellow-600 text-sm select-none">
              Old data — press Search
            </p>
          )}
        </div>

        <button
          onClick={() => fetchSearchResults(searchInput)}
          disabled={!searchInput.trim()}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
        >
          Search
        </button>

        {activeSearch && (
          <button
            onClick={() => {
              setActiveSearch(null);
              setSearchInput("");
              setErrorSearch(null);
            }}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
          >
            <XCircle className="h-4 w-4 mr-2" /> Reset Search
          </button>
        )}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "newest" | "oldest" | "repo")
          }
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="repo">By Repository</option>
        </select>
      </div>

      {/* PR List */}
      {loadingSearch ? (
        <div className="flex justify-center items-center h-40">
          <Hourglass className="animate-spin h-8 w-8 text-indigo-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">
            Searching PRs...
          </span>
        </div>
      ) : errorSearch ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          {errorSearch}
        </div>
      ) : displayedPRs.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-600 dark:text-gray-400 text-center">
          No pull requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPRs.map((pr) => (
            <PRCard key={pr.id} pr={pr} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!activeSearch && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white"
            }`}
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              !prPages[currentPage + 1] || prPages[currentPage + 1].length === 0
            }
            className={`px-4 py-2 rounded-lg ${
              !prPages[currentPage + 1] || prPages[currentPage + 1].length === 0
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);
