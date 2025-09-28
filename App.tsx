import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import GameScreen from './src/components/GameScreen';

export default function App() {
  return (
    <Provider store={store}>
      <GameScreen />
      <StatusBar style="auto" />
    </Provider>
  );
}