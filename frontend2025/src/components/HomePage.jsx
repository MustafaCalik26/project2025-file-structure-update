import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/authApi';
// import '../styles/Home.css';

// import { TextField, Button, Typography, Container, Stack } from '@mui/material';
//No need anymore 

export default function HomeForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username.trim() || !password) return;
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await login(username, password);
        localStorage.setItem('token', res.data.token);
        navigate('/game');
      } else {
        await register(username, password);
        alert('Registration successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-200 flex flex-col items-center">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <div className="flex flex-col space-y-6 items-center">
          {/* Dont Know why but cant add space between button and inputs  */}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page refresh
              handleSubmit();
            }}
            className="flex flex-col space-y-6 items-center"
          >
          {/*I added form just to be able to press enter */}
        
          <input
            type="text"
            placeholder="Username"
            className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type='submit'
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-72 py-2 text-white rounded-lg transition-colors duration-200 ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
          <a
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Register' : 'Login'}
          </a>
        </p>
      </div>
    </div>
    // I am no expert in styling so it does not look great tailwind is a bit complicated
    //Mui is easier to use cause it has it own themes :D manually trying needs a bit creativity in design
  );
}
