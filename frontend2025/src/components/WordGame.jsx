import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageFromUrl } from '../hooks/useEffect.js';
import confetti from 'canvas-confetti';
import '../styles/game.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from '@mui/material';
import { fetchWord, submitGuess, fetchHint } from '../api/gameApi'; //AXIOS IS GONE HERE
import { useUser } from '../context/UserContext.jsx';
import { useScore } from '../context/ScoreContext.jsx';

function WordGame() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'easy';
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { incrementCorrect, incrementWrong } = useScore();



  useLanguageFromUrl(i18n, searchParams);

  useEffect(() => {
    if (!user) {
      navigate('/'); //Will Nav to Login page cause even if they dont log in can just acces via URL
    }
  }, [user]);


  //can click on button and press enter either
  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() === '') return;
    guessMutation.mutate(guess);
  };



  // fetch word 
  const {
    data: scrambled,
    isLoading,
    isError,
    refetch: fetchNewWord,
  } = useQuery({
    queryKey: ['word', difficulty],
    // queryFn: fetchWord,
    queryFn: () => fetchWord(difficulty),//need arrow func cause were now giving a param

  });

  const guessMutation = useMutation({
    mutationFn: submitGuess,
    onSuccess: (data) => {
      setResult(data);

      if (data.toLowerCase().includes('correct')) {
        // setCorrectCount(prev => prev + 1);
        incrementCorrect();
        console.log("Incrementing correct score");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        queryClient.invalidateQueries(['word']);
        queryClient.removeQueries(['hint']);
        setGuess('');
      } else {
        incrementWrong();
        console.log("Incrementing wrong score");
      }
    },
    onError: () => {
      setResult('Error submitting guess');
    }
  });

  // get hint
  const {
    data: hint,
    refetch: fetchHintQuery,
    isFetching: hintLoading,
    isError: hintError,
  } = useQuery({
    queryKey: ['hint'],
    queryFn: fetchHint,
    enabled: false,
  });

  // give word when page opens so user does not have to do manually
  useEffect(() => {
    fetchNewWord();
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300, // MUI'nın overlay seviyesine yakın bir değer
        }}
      >
        <Button variant="contained" onClick={() => navigate('/profile')}>
          Profile
        </Button>
      </Box>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button onClick={() => i18n.changeLanguage('en')}>EN</Button>
            <Button onClick={() => i18n.changeLanguage('tr')}>TR</Button>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button variant="contained" color="success" onClick={() => setSearchParams({ difficulty: 'easy' })}>
              {t('easy')}
            </Button>
            <Button variant="contained" color="warning" onClick={() => setSearchParams({ difficulty: 'normal' })}>
              {t('normal')}
            </Button>
            <Button variant="contained" color="error" onClick={() => setSearchParams({ difficulty: 'hard' })}>
              {t('hard')}
            </Button>
          </Stack>
          <Typography variant="h4" sx={{ color: '#333', fontSize: 45, borderBottom: '2px solid black', pb: 2 }} gutterBottom>
            {t('title')}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {t('scrambled')}
          </Typography>

          <Box sx={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            bgcolor: '#fff',
            p: 2,
            mb: 2,
            borderRadius: 2,
            boxShadow: 1,
            width: 'fit-content',
            mx: 'auto',
          }}>
            {isLoading ? <CircularProgress size={24} /> : isError ? t('error_loading_word') : scrambled}
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label={t('guess_here')}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button
                type='submit'
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                disabled={guessMutation.isLoading}
              >
                {t('guess')}
              </Button>
            </Box>
          </form>

          <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => fetchNewWord()}>
              {t('new_word')}
            </Button>
            <Button variant="contained" onClick={() => fetchHintQuery()}>
              {t('get_hint')}
            </Button>
          </Stack>

          {result && (
            <Alert severity={result.toLowerCase().includes('correct') ? 'success' : 'info'}>
              {result}
            </Alert>
          )}

          {hintLoading ? (
            <Typography variant="body2" sx={{ mt: 2 }}>{t('loading_hint')}</Typography>
          ) : hintError ? (
            <Alert severity="error" sx={{ mt: 2 }}>{t('error_fetching_hint')}</Alert>
          ) : (
            hint && <Typography variant="body2" sx={{ mt: 2 }}>{hint}</Typography>
          )}
        </Paper>
        <Box
          component="footer"
          sx={{
            mt: 4,
            pt: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.6)' }}>
            Author: Mustafa Calik
          </Typography>
          <Link
            href="https://instagram.com/x.calik"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#E1306C', fontSize: 30 }}
          >
            <InstagramIcon />
          </Link>
        </Box>
      </Container>
    </>
  );
}

export default WordGame;