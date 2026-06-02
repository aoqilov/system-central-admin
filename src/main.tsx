import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './chakra-system'
import { ThemeProvider } from './context/ThemeContext'
import { OperatorRoundsProvider } from './context/OperatorRoundsContext'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <OperatorRoundsProvider>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
      </OperatorRoundsProvider>
    </ThemeProvider>
  </StrictMode>
)
