import { useEffect, useState } from 'react';
import axios from 'axios';
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
  // InstagramIcon
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from '@mui/material';

const API = 'http://localhost:8080/api';

function WordGame() {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');

  const queryClient = useQueryClient();

  // fetch word 
  const fetchWord = async () => {
    const res = await axios.get(`${API}/word`);
    return res.data;
  };

  const {
    data: scrambled,
    isLoading,
    isError,
    refetch: fetchNewWord,
  } = useQuery({
    queryKey: ['word'],
    queryFn: fetchWord,
  });;


  const guessMutation = useMutation({
    mutationFn: async (userGuess) => {
      const res = await axios.post(`${API}/guess`, { guess: userGuess });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);

      if (data.toLowerCase().includes('correct')) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        queryClient.invalidateQueries(['word']);
        queryClient.removeQueries(['hint']);
        setGuess('');
      }
    },
    onError: () => {
      setResult('Error submitting guess');
    }
  });

  // get hint
  const {
    data: hint,
    refetch: fetchHint,
    isFetching: hintLoading,
    isError: hintError,
  } = useQuery({
    queryKey: ['hint'],
    queryFn: async () => {
      const res = await axios.get(`${API}/hint`);
      return `Hint: ${res.data}`;
    },
    enabled: false,
  });

  // give word when page opens so user does not have to do manually
  useEffect(() => {
    fetchNewWord();
  }, []);

  return (
    
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ color: '#333', fontSize: 45, borderBottom: '2px solid black', pb: 2 }} gutterBottom>
          Word Guessing Game
        </Typography>

        <Typography variant="h6" gutterBottom>
          Scrambled Word:
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
          {isLoading ? <CircularProgress size={24} /> : isError ? 'Error loading word' : scrambled}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Guess here"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => guessMutation.mutate(guess)}
            sx={{
              px: 3,
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            Guess
          </Button>
        </Box>

        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => guessMutation.mutate(guess)}
          >
            Guess
          </Button> */}
          <Button variant="contained" onClick={() => fetchNewWord()}>
            New Word
          </Button>
          <Button variant="contained" onClick={() => fetchHint()}>
            Get Hint
          </Button>
        </Stack>

        {result && (
          <Alert severity={result.toLowerCase().includes('correct') ? 'success' : 'info'}>
            {result}
          </Alert>
        )}

        {hintLoading ? (
          <Typography variant="body2" sx={{ mt: 2 }}>Loading hint...</Typography>
        ) : hintError ? (
          <Alert severity="error" sx={{ mt: 2 }}>Error fetching hint</Alert>
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
        <Typography variant="body1"  sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.6)' }}>
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
   
  );
}

export default WordGame;
