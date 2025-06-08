// components/HomeForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

export default function HomeForm() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (username.trim() !== '') {
      try {
        await axios.post('http://localhost:8080/api/users', { username });
        navigate('/game');
      } catch (error) {
        console.error('❌ Failed to save user:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Failed to save user.');
      }
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-heading">Welcome to the Word Game!</h2>
      <p className="home-paragraph">Enter your username to start!!!</p>
      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="username-input"
      />
      <br />
      <button
        className="home-link"
        onClick={handleStart}
        disabled={username.trim() === ''}
      >
        Start Game
      </button>
    </div>
  );
}
