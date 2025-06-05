import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WordGame from './components/WordGame';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <WordGame />
      </div>
    </QueryClientProvider>
  );
}

export default App;