import { Suspense } from 'react';
import { BrowserRouter } from 'react-router'
import { Router } from './routes'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from './components/utils/loadingSpiner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Router />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
