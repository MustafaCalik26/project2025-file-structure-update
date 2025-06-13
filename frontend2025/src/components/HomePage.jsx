// components/HomeForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

import { TextField, Button, Typography, Container, Stack } from '@mui/material';

export default function HomeForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username.trim() || !password) return;
 if (handleSubmit.loading) return;
  handleSubmit.loading = true;
    const endpoint = isLogin ? 'login' : 'users';
    try {
      const res = await axios.post(`http://localhost:8080/api/${endpoint}`, {
        username,
        password
      });

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/game');
      } else {
        alert('Registration successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isLogin ? 'Login' : 'Register'}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {isLogin ? 'Log In' : 'Register'}
        </Button>

        <Button
          variant="text"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
        </Button>
      </Stack>
    </Container>
  );
}
