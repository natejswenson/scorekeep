import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameScreen from '../src/components/GameScreen';
import { gameSlice } from '../src/store/gameSlice';

const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameSlice.reducer,
    },
    preloadedState: initialState,
  });
};

describe('Game Wins Integration', () => {
  describe('Tally Independence from Scoring', () => {
    test('should maintain tally independence from scoring', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Increment scores
      fireEvent.press(getByTestId('team1-score-area'));
      fireEvent.press(getByTestId('team2-score-area'));

      // Verify scores changed but tallies remain 0
      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
      expect(state.team2.score).toBe(1);
      expect(state.gameWins.team1).toBe(0);
      expect(state.gameWins.team2).toBe(0);
    });

    test('should preserve tallies when game is reset', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Set some scores and wins
      fireEvent.press(getByTestId('team1-score-area'));
      fireEvent.press(getByTestId('team2-score-area'));
      fireEvent.press(getByTestId('team1-wins-increment'));
      fireEvent.press(getByTestId('team2-wins-increment'));

      // Reset scores
      fireEvent.press(getByTestId('reset-button'));

      // Verify scores reset but tallies remain
      const state = store.getState().game;
      expect(state.team1.score).toBe(0);
      expect(state.team2.score).toBe(0);
      expect(state.gameWins.team1).toBe(1);
      expect(state.gameWins.team2).toBe(1);
    });
  });

  describe('Tally Display', () => {
    test('should display tallies at bottom of each team section', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      expect(getByTestId('team1-wins')).toBeTruthy();
      expect(getByTestId('team2-wins')).toBeTruthy();
    });

    test('should update tally displays when wins change', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');

      fireEvent.press(getByTestId('team2-wins-increment'));
      fireEvent.press(getByTestId('team2-wins-increment'));
      expect(getByTestId('team2-wins')).toHaveTextContent('2');
    });
  });

  describe('Tally Badge', () => {
    test('should display tally badge above reset button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      expect(getByTestId('landscape-tally-badge')).toBeTruthy();
    });

    test('should display correct tally when wins change', () => {
      const store = createTestStore();
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Initial: 0 - 0
      expect(getByText('0 - 0')).toBeTruthy();

      // After incrementing: 1 - 0
      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(getByText('1 - 0')).toBeTruthy();

      // After incrementing both: 1 - 1
      fireEvent.press(getByTestId('team2-wins-increment'));
      expect(getByText('1 - 1')).toBeTruthy();
    });
  });

  describe('Tally Controls', () => {
    test('should increment team1 wins', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
    });

    test('should decrement team1 wins when positive', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      fireEvent.press(getByTestId('team1-wins-increment'));
      fireEvent.press(getByTestId('team1-wins-increment'));
      fireEvent.press(getByTestId('team1-wins-decrement-button'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
    });

    test('should not decrement team wins below zero', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      fireEvent.press(getByTestId('team1-wins-decrement-button'));
      expect(getByTestId('team1-wins')).toHaveTextContent('0');
    });
  });

  describe('Component Independence', () => {
    test('should work alongside team name editing', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Edit team name
      fireEvent.press(getByTestId('team1-edit-icon'));
      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, 'New Team');
      fireEvent(input, 'blur');

      // Verify tally functionality still works
      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');

      const state = store.getState().game;
      expect(state.team1.name).toBe('New Team');
    });

    test('should maintain component isolation', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Increment score
      fireEvent.press(getByTestId('team1-score-area'));

      // Increment wins
      fireEvent.press(getByTestId('team1-wins-increment'));

      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
      expect(state.gameWins.team1).toBe(1);
      expect(state.scoreIncrement).toBe(1);
      expect(state.winCondition).toBe(10);
    });
  });
});
