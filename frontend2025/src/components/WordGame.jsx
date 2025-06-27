import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageFromUrl } from '../hooks/useEffect.js';
import confetti from 'canvas-confetti';
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
  Link,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { fetchWord, submitGuess, fetchHint } from '../api/gameApi';
import { useUser } from '../context/UserContext.jsx';
import { useScore } from '../context/ScoreContext.jsx';
import logo from '../background_Homepage/logo.png';

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
  const [isShaking, setIsShaking] = useState(false);
  

  useLanguageFromUrl(i18n, searchParams);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() === '') return;
    guessMutation.mutate(guess.trim());
  };

  const {
    data: scrambled,
    isLoading,
    isError,
    refetch: fetchNewWord,
  } = useQuery({
    queryKey: ['word', difficulty],
    queryFn: () => fetchWord(difficulty),
    staleTime: 10000,
  });

  const guessMutation = useMutation({
    mutationFn: submitGuess,
    onSuccess: (data) => {
      if (data.toLowerCase().includes('correct')) {
        setResult(t('guess_correct'));
        incrementCorrect();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        queryClient.invalidateQueries(['word', difficulty]);
        queryClient.removeQueries(['hint']);
        setGuess('');
      } else {
        setResult(t('guess_wrong'));
        incrementWrong();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
    },
    onError: () => {
      setResult(t('something_went_wrong'));
    },
  });

  const {
    data: hint,
    refetch: fetchHintQuery,
    isFetching: hintLoading,
    isError: hintError,
    error: hintErrorObj,
  } = useQuery({
    queryKey: ['hint'],
    queryFn: fetchHint,
    enabled: false,
  });

  // useEffect(() => {
  //   fetchNewWord();
  // }, [difficulty]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate('/profile')}
          sx={{ borderColor: 'white', color: 'white' }}
        >
          {t('profile')}
        </Button>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          mt: 6,
          mb: 6,
          maxHeight: '90vh',
          overflowY: 'auto',
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          className={isShaking ? 'shake' : ''}
          sx={{
            bgcolor: '#1f2937',
            color: 'white',
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '60vh',
            position: 'relative',
          }}
        >
          {/* my new ai generated logo */}
          <Box sx={{ mb: 3 }}>
            <img
              src={logo}
              alt="logo"
              style={{ width: 70, height: 'auto' }}
            />
          </Box>

          {/* en,tr language */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <Button size="small" onClick={() => i18n.changeLanguage('en')} sx={{ color: 'white' }}>
              EN
            </Button>
            <Button size="small" onClick={() => i18n.changeLanguage('tr')} sx={{ color: 'white' }}>
              TR
            </Button>
          </Stack>

          {/* not working diffic buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3, width: '100%' }}
          >
            <Button
              variant={difficulty === 'easy' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => setSearchParams({ difficulty: 'easy' })}
            >
              {t('easy')}
            </Button>
            <Button
              variant={difficulty === 'normal' ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => setSearchParams({ difficulty: 'normal' })}
            >
              {t('normal')}
            </Button>
            <Button
              variant={difficulty === 'hard' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => setSearchParams({ difficulty: 'hard' })}
            >
              {t('hard')}
            </Button>
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: '700',
              borderBottom: '3px solid #3b82f6',
              pb: 2,
              mb: 3,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {t('title')}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>
            {t('scrambled')}
          </Typography>

          <Box
            sx={{
              fontSize: '2rem',
              fontWeight: '700',
              bgcolor: '#374151',
              p: 3,
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
              textAlign: 'center',
              minHeight: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              wordBreak: 'break-word',
            }}
          >
            {isLoading ? (
              <CircularProgress size={30} color="inherit" />
            ) : isError ? (
              t('error_loading_word')
            ) : (
              scrambled
            )}
          </Box>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                size="small"
                label={t('guess_here')}
                variant="filled"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                autoComplete="off"
                InputLabelProps={{ style: { color: 'rgba(255 255 255 / 0.8)' } }}
                sx={{
                  bgcolor: '#374151',
                  borderRadius: 1,
                  input: { color: 'white' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ minWidth: 120 }}
                disabled={guessMutation.isLoading}
              >
                {t('guess')}
              </Button>
            </Stack>
          </form>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3, width: '100%' }}
          >
            <Button variant="outlined" color="inherit" onClick={() => fetchNewWord()}>
              {t('new_word')}
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => fetchHintQuery()}>
              {t('get_hint')}
            </Button>
          </Stack>
          {result && (
            <Alert
              severity={result.toLowerCase().includes('correct') ? 'success' : 'info'}
              sx={{ color: 'black', width: '100%' }}
            >
              {result}
            </Alert>
          )}
          {hintLoading ? (
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
              {t('loading_hint')}
            </Typography>
          ) : hintError ? (
            hintErrorObj?.response?.status === 403 ? (
              <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
                {t('hint_limit_reached')}
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {t('error_fetching_hint')}
              </Alert>
            )
          ) : (
            hint && (
              <Typography
                variant="body2"
                sx={{ mt: 2, fontStyle: 'italic', textAlign: 'center', color: 'white' }}
              >
                {hint}
              </Typography>
            )
          )}

          {/* Footer and insta */}
          <Box
            component="footer"
            sx={{
              mt: 5,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
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
        </Paper>
      </Container>
    </>
  );
}

export default WordGame;
