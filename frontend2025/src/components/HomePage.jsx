// components/HomeForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

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
    <div className="home-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {isLogin ? 'Log In' : 'Register'}
      </button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
