import { useEffect, useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import '../styles/game.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    <section>
      <h1>Word Guessing</h1>
      <p>Scrambled Word:</p>
      <div className="box">
        {isLoading ? 'Loading...' : isError ? 'Error loading word' : scrambled}
      </div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Guess here"
      />
      <button onClick={() => guessMutation.mutate(guess)}>Guess</button>
      <p>{result}</p>
      <button onClick={() => fetchNewWord()}>New Word</button>
      <button onClick={() => fetchHint()}>Get Hint</button>
      <p>{hintLoading ? 'Loading hint...' : hintError ? 'Error fetching hint' : hint}</p>
    </section>
  );
}

export default WordGame;
