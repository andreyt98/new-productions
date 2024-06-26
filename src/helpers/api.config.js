export const API_KEY = import.meta.env.VITE_API_KEY;

export const apiUrl = `https://api.themoviedb.org/3/`;
export const image = `https://image.tmdb.org/t/p/original`
export const imageWithSize =  (size) => `https://image.tmdb.org/t/p/w${size}`