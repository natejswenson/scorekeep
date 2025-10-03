import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../store/gameSlice';
import { store as defaultStore, RootState } from '../store';
import { theme } from '../theme';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: typeof defaultStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const testStore =
    store ||
    (preloadedState
      ? configureStore({
          reducer: { game: gameReducer },
          preloadedState: preloadedState as RootState,
        })
      : defaultStore);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={testStore}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { store: testStore, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
