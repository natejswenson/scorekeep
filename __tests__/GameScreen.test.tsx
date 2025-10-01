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
        editingTeam: null,
        gameWins: { team1: 0, team2: 0 },
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
        editingTeam: null,
        gameWins: { team1: 0, team2: 0 },
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
        editingTeam: null,
        gameWins: { team1: 0, team2: 0 },
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

  test('should have reset button in middle controls', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    const resetButton = getByTestId('reset-button');
    expect(resetButton).toHaveStyle({
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 35,
      width: 70,
      height: 70,
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

  describe('Game Wins Tally Integration', () => {
    test('should display game wins tallies for both teams', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 0, color: '#FF0000' },
          team2: { name: 'Team 2', score: 0, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 1 },
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      expect(getByTestId('team1-wins-count')).toHaveTextContent('2');
      expect(getByTestId('team2-wins-count')).toHaveTextContent('1');
    });

    test('should display total game counter correctly', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 0, color: '#FF0000' },
          team2: { name: 'Team 2', score: 0, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 1, team2: 1 },
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('3'); // 1 + 1 + 1
    });

    test('should increment team wins when tally controls are used', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Increment team1 wins
      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins-count')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('2'); // 1 + 0 + 1

      // Increment team2 wins
      fireEvent.press(getByTestId('team2-wins-increment'));
      expect(getByTestId('team2-wins-count')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('3'); // 1 + 1 + 1
    });

    test('should decrement team wins when decrement buttons are used', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 0, color: '#FF0000' },
          team2: { name: 'Team 2', score: 0, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 1 },
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Decrement team1 wins
      fireEvent.press(getByTestId('team1-wins-decrement'));
      expect(getByTestId('team1-wins-count')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('3'); // 1 + 1 + 1

      // Decrement team2 wins
      fireEvent.press(getByTestId('team2-wins-decrement'));
      expect(getByTestId('team2-wins-count')).toHaveTextContent('0');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('2'); // 1 + 0 + 1
    });

    test('should preserve game wins when scores are reset', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 5, color: '#FF0000' },
          team2: { name: 'Team 2', score: 3, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 1 },
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Reset scores
      fireEvent.press(getByTestId('reset-button'));

      // Scores should be reset
      expect(getByTestId('team1-score')).toHaveTextContent('0');
      expect(getByTestId('team2-score')).toHaveTextContent('0');

      // Game wins should be preserved
      expect(getByTestId('team1-wins-count')).toHaveTextContent('2');
      expect(getByTestId('team2-wins-count')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('4'); // 2 + 1 + 1
    });

    test('should maintain independence between scoring and tally systems', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Perform scoring operations
      fireEvent.press(getByTestId('team1-score-area'));
      fireEvent.press(getByTestId('team2-score-area'));
      fireEvent.press(getByTestId('team1-decrement'));

      // Perform tally operations
      fireEvent.press(getByTestId('team1-wins-increment'));
      fireEvent.press(getByTestId('team2-wins-increment'));

      // Check that both systems work independently
      expect(getByTestId('team1-score')).toHaveTextContent('0'); // 1 - 1 = 0
      expect(getByTestId('team2-score')).toHaveTextContent('1');
      expect(getByTestId('team1-wins-count')).toHaveTextContent('1');
      expect(getByTestId('team2-wins-count')).toHaveTextContent('1');
    });

    test('should work alongside team name editing without interference', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Edit team name
      fireEvent.press(getByTestId('team1-edit-icon'));
      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, 'Winners');
      fireEvent(input, 'blur');

      // Increment wins
      fireEvent.press(getByTestId('team1-wins-increment'));

      // Both features should work
      expect(getByTestId('team1-name')).toHaveTextContent('Winners');
      expect(getByTestId('team1-wins-count')).toHaveTextContent('1');
    });
  });
});