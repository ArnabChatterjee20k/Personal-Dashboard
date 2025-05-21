export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'todo' | 'in-progress' | 'solved';
  tags: string[];
  url?: string;
  notes?: string;
  createdAt: string;
}

export const getProblems = (): Problem[] => {
  const problemsString = localStorage.getItem('problems');
  if (!problemsString) return [];
  
  try {
    return JSON.parse(problemsString);
  } catch (error) {
    console.error('Error parsing problems from localStorage:', error);
    return [];
  }
};

export const saveProblems = (problems: Problem[]): void => {
  localStorage.setItem('problems', JSON.stringify(problems));
};