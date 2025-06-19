import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import './index.css';
import { UserProvider } from './context/UserContext';
import Profile from './pages/Profile';
import { ScoreProvider } from './context/ScoreContext'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ScoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </ScoreProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App;
