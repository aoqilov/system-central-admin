import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { system } from './chakra-system'
import { ThemeProvider } from './context/ThemeContext'
import queryClient from './api-config/queryClient'
import './api-config/interceptors'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
