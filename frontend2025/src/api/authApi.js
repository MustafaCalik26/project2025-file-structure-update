import apiClient from './apiClient';

export const login = (username, password,rememberMe =false) =>
  apiClient.post('/login', { username, password,rememberMe});

export const register = (username, password) =>
  apiClient.post('/users', { username, password });