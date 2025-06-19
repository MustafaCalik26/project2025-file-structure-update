import React, { createContext, useContext, useState, useEffect } from 'react';

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [correct, setCorrect] = useState(() => {
    const saved = localStorage.getItem('correct');
    return saved ? JSON.parse(saved) : 0;
  });

  const [wrong, setWrong] = useState(() => {
    const saved = localStorage.getItem('wrong');
    return saved ? JSON.parse(saved) : 0;
  });

useEffect(() => {
    localStorage.setItem('correct', JSON.stringify(correct));
  }, [correct]);

  useEffect(() => {
    localStorage.setItem('wrong', JSON.stringify(wrong));
  }, [wrong]);


  
  const incrementCorrect = () => setCorrect(c => c + 1);
  const incrementWrong = () => setWrong(w => w + 1);
//   const resetScores = () => {
//     setCorrect(0);
//     setWrong(0);
//   };

  return (
    <ScoreContext.Provider value={{ correct, wrong, incrementCorrect, incrementWrong, }}> 
    
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
