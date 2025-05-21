export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const getTodos = (): Todo[] => {
  const todosString = localStorage.getItem('todos');
  if (!todosString) return [];
  
  try {
    return JSON.parse(todosString);
  } catch (error) {
    console.error('Error parsing todos from localStorage:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};