import apiClient from './apiClient';

export const login = (username, password) =>
  apiClient.post('/login', { username, password});

export const register = (username, password) =>
  apiClient.post('/users', { username, password });