import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/he'
import './index.css'
import App from './App.tsx'
import theme from './styles/theme'
import { useFinanceStore } from './store/financeStore'

void useFinanceStore.getState().initialize()
dayjs.locale('he')
document.documentElement.setAttribute('lang', 'he')
document.documentElement.setAttribute('dir', 'rtl')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
