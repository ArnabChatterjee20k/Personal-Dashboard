export interface Movie {
  id: string;
  title: string;
  director: string;
  year: string;
  genre: string;
  watched: boolean;
  addedAt: string;
}

export const getMovies = (): Movie[] => {
  const moviesString = localStorage.getItem('movies');
  if (!moviesString) return [];
  
  try {
    return JSON.parse(moviesString);
  } catch (error) {
    console.error('Error parsing movies from localStorage:', error);
    return [];
  }
};

export const saveMovies = (movies: Movie[]): void => {
  localStorage.setItem('movies', JSON.stringify(movies));
};