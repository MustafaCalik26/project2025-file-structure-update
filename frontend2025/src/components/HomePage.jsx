import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, register } from '../api/authApi';
import { useTranslation } from 'react-i18next';
import { useLanguageFromUrl } from '../hooks/useEffect.js';
import { useUser } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFingerprint } from 'react-icons/fa';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';



// import { TextField, Button, Typography, Container, Stack } from '@mui/material';
//No need anymore 

export default function HomeForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  useLanguageFromUrl(i18n, searchParams);
  const { user, setUser } = useUser();
  console.log(user?.username);
  //Testing Rn

  const handleSubmit = async () => {
    if (!username.trim() || !password) return;
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await login(username, password);
        localStorage.setItem('token', res.data.token);
        setUser({ username, token: res.data.token });
        navigate('/game');
      } else {
        await register(username, password);
        toast.success(t('registration_successful'));
        setIsLogin(true);
      }
    } catch (error) {
      console.log('Hata cevabı:', error.response?.data);
      const errorCode = error.response?.data?.error_code;

      let message;
      switch (errorCode) {
        case 'USER_NOT_FOUND':
          message = t('user_not_found');
          break;
        case 'INVALID_PASSWORD':
          message = t('invalid_password');
          break;
        case 'BAD_REQUEST':
          message = t('bad_request');
          break;
        case 'TOO_MANY_ATTEMPTS':
          message = t('too_many_attempts');
          break;
        case 'SERVER_ERROR':
          message = t('server_error');
          break;
        default:
          message = error.response?.data?.error || t('something_went_wrong');
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      <div className="w-[90%] max-w-sm md:max-w-md p-5 bg-gray-900 flex-col flex items-center gap-4 rounded-xl shadow-slate-400 shadow-lg">
        <img src="../background_Homepage/logo.png" alt="logo" className="w-12 md:w-14" />
        <h1 className="text-lg md:text-xl font-semibold">
          {isLogin ? t('login') : t('register')}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 text-center">
          {isLogin ? t('no_account') : t('have_account')}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-white underline cursor-pointer"
          >
            {isLogin ? t('register') : t('login')}
          </span>
        </p>

        <form className="w-full flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="text"
              placeholder={t('username')}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('password')}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 rounded-xl mt-3 text-sm md:text-base ${
              isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? t('loading') : isLogin ? t('login') : t('register')}
          </button>
        </form>

        <div className="w-full flex justify-center mt-3 gap-4">
          <button onClick={() => i18n.changeLanguage('en')} className="text-xs underline">EN</button>
          <button onClick={() => i18n.changeLanguage('tr')} className="text-xs underline">TR</button>
        </div>
      </div>

      <ToastContainer
        key={i18n.language}
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  

    // I am no expert in styling so it does not look great tailwind is a bit complicated
  );
} 
