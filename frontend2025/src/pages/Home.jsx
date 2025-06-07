import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h2>Welcome to the Word Game!</h2>
      <p>Click below to play:</p>
      <Link to="/game">Start Game</Link>
      {/* Its not styled, for now it will do the job ive implemented router succesfully */}
    </div>
  );
}
