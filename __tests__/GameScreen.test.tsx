import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameScreen from '../src/components/GameScreen';
import { gameSlice } from '../src/store/gameSlice';

// Test store factory
const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameSlice.reducer,
    },
    preloadedState: initialState,
  });
};

describe('Core Scoring', () => {
  test('should display initial scores of 0-0', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    expect(getByTestId('team1-score')).toHaveTextContent('0');
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });

  test('should increment team score when tapped', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('team1-score-area'));
    expect(getByTestId('team1-score')).toHaveTextContent('1');

    fireEvent.press(getByTestId('team2-score-area'));
    expect(getByTestId('team2-score')).toHaveTextContent('1');
  });

  test('should decrement team score when minus button pressed', () => {
    const store = createTestStore({
      game: {
        team1: { name: 'Team 1', score: 3, color: '#FF0000' },
        team2: { name: 'Team 2', score: 2, color: '#0000FF' },
        scoreIncrement: 1,
        winCondition: 10,
        isGameActive: true,
        winner: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('team1-decrement'));
    expect(getByTestId('team1-score')).toHaveTextContent('2');

    fireEvent.press(getByTestId('team2-decrement'));
    expect(getByTestId('team2-score')).toHaveTextContent('1');
  });

  test('should not allow negative scores', () => {
    const store = createTestStore({
      game: {
        team1: { name: 'Team 1', score: 0, color: '#FF0000' },
        team2: { name: 'Team 2', score: 0, color: '#0000FF' },
        scoreIncrement: 1,
        winCondition: 10,
        isGameActive: true,
        winner: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('team1-decrement'));
    expect(getByTestId('team1-score')).toHaveTextContent('0');

    fireEvent.press(getByTestId('team2-decrement'));
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });

  test('should reset both scores to zero', () => {
    const store = createTestStore({
      game: {
        team1: { name: 'Team 1', score: 5, color: '#FF0000' },
        team2: { name: 'Team 2', score: 3, color: '#0000FF' },
        scoreIncrement: 1,
        winCondition: 10,
        isGameActive: true,
        winner: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('reset-button'));
    expect(getByTestId('team1-score')).toHaveTextContent('0');
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });
});

describe('Visual Design Specification', () => {
  test('should display team 1 side with red background', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    const team1Side = getByTestId('team1-side');
    expect(team1Side).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  test('should display team 2 side with blue background', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    const team2Side = getByTestId('team2-side');
    expect(team2Side).toHaveStyle({ backgroundColor: '#0000FF' });
  });

  test('should display white text on colored backgrounds', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    expect(getByTestId('team1-name')).toHaveStyle({ color: '#FFFFFF' });
    expect(getByTestId('team2-name')).toHaveStyle({ color: '#FFFFFF' });
    expect(getByTestId('team1-score')).toHaveStyle({ color: '#FFFFFF' });
    expect(getByTestId('team2-score')).toHaveStyle({ color: '#FFFFFF' });
  });

  test('should have centered reset icon', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    const resetButton = getByTestId('reset-button');
    expect(resetButton).toHaveStyle({
      position: 'absolute',
      left: '50%',
      top: '50%',
    });
  });

  describe('Team Name Editing Integration', () => {
    test('should enter edit mode when edit icon is pressed', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      fireEvent.press(getByTestId('team1-edit-icon'));
      expect(getByTestId('team1-name-input')).toBeTruthy();
    });

    test('should save team name when input loses focus', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Enter edit mode
      fireEvent.press(getByTestId('team1-edit-icon'));

      // Change name and blur
      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, 'New Team Name');
      fireEvent(input, 'blur');

      // Should display new name
      expect(getByTestId('team1-name')).toHaveTextContent('New Team Name');
    });

    test('should cancel edit mode when escape is pressed', () => {
      const store = createTestStore();
      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Enter edit mode
      fireEvent.press(getByTestId('team2-edit-icon'));
      expect(getByTestId('team2-name-input')).toBeTruthy();

      // Press escape
      const input = getByTestId('team2-name-input');
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Escape' } });

      // Should exit edit mode
      expect(queryByTestId('team2-name-input')).toBeNull();
      expect(getByTestId('team2-name')).toBeTruthy();
    });

    test('should preserve scores when editing team names', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Set some scores
      fireEvent.press(getByTestId('team1-score-area'));
      fireEvent.press(getByTestId('team2-score-area'));
      fireEvent.press(getByTestId('team2-score-area'));

      expect(getByTestId('team1-score')).toHaveTextContent('1');
      expect(getByTestId('team2-score')).toHaveTextContent('2');

      // Edit team name
      fireEvent.press(getByTestId('team1-edit-icon'));
      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, 'Scorers');
      fireEvent(input, 'blur');

      // Scores should be preserved
      expect(getByTestId('team1-score')).toHaveTextContent('1');
      expect(getByTestId('team2-score')).toHaveTextContent('2');
      expect(getByTestId('team1-name')).toHaveTextContent('Scorers');
    });
  });
});