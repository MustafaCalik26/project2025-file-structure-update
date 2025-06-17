import apiClient from './apiClient';

export const fetchWord = () => apiClient.get('/word').then(res => res.data);

export const submitGuess = (guess) =>
  apiClient.post('/guess', { guess }).then(res => res.data);

export const fetchHint = () =>
  apiClient.get('/hint').then(res => `Hint: ${res.data}`);