import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './src/store';
import { theme } from './src/theme';
import GameScreen from './src/components/GameScreen';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GameScreen />
      </ThemeProvider>
    </Provider>
  );
}