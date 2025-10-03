import React from 'react';
import { render, fireEvent } from '../src/test-utils/test-utils';
import GameScreen from '../src/components/GameScreen';

// Set landscape mode for all tests in this file
beforeEach(() => {
  window.innerWidth = 800;
  window.innerHeight = 400;
});

describe('Game Wins Integration', () => {
  describe('Tally Independence from Scoring', () => {
    test('should maintain tally independence from scoring', () => {
      const { getByTestId, store } = render(<GameScreen />);

      // Increment scores
      fireEvent.click(getByTestId('team1-score-area'));
      fireEvent.click(getByTestId('team2-score-area'));

      // Verify scores changed but tallies remain 0
      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
      expect(state.team2.score).toBe(1);
      expect(state.gameWins.team1).toBe(0);
      expect(state.gameWins.team2).toBe(0);
    });

    test('should preserve tallies when game is reset', () => {
      const { getByTestId, store } = render(<GameScreen />);

      // Set some scores and wins
      fireEvent.click(getByTestId('team1-score-area'));
      fireEvent.click(getByTestId('team2-score-area'));
      fireEvent.click(getByTestId('team1-wins-increment'));
      fireEvent.click(getByTestId('team2-wins-increment'));

      // Reset scores
      fireEvent.click(getByTestId('reset-button'));

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
      const { getByTestId, store } = render(<GameScreen />);

      expect(getByTestId('team1-wins')).toBeTruthy();
      expect(getByTestId('team2-wins')).toBeTruthy();
    });

    test('should update tally displays when wins change', () => {
      const { getByTestId, store } = render(<GameScreen />);

      fireEvent.click(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');

      fireEvent.click(getByTestId('team2-wins-increment'));
      fireEvent.click(getByTestId('team2-wins-increment'));
      expect(getByTestId('team2-wins')).toHaveTextContent('2');
    });
  });

  describe('Tally Badge', () => {
    test('should display tally badge above reset button', () => {
      const { getByTestId, store } = render(<GameScreen />);

      expect(getByTestId('landscape-tally-badge')).toBeTruthy();
    });

    test('should display correct tally when wins change', () => {
      const { getByTestId, getByText, store } = render(<GameScreen />);

      // Initial: 0 - 0
      expect(getByText('0 - 0')).toBeTruthy();

      // After incrementing: 1 - 0
      fireEvent.click(getByTestId('team1-wins-increment'));
      expect(getByText('1 - 0')).toBeTruthy();

      // After incrementing both: 1 - 1
      fireEvent.click(getByTestId('team2-wins-increment'));
      expect(getByText('1 - 1')).toBeTruthy();
    });
  });

  describe('Tally Controls', () => {
    test('should increment team1 wins', () => {
      const { getByTestId, store } = render(<GameScreen />);

      fireEvent.click(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
    });

    test('should decrement team1 wins when positive', () => {
      const { getByTestId, store } = render(<GameScreen />);

      fireEvent.click(getByTestId('team1-wins-increment'));
      fireEvent.click(getByTestId('team1-wins-increment'));
      fireEvent.click(getByTestId('team1-wins-decrement'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
    });

    test('should not decrement team wins below zero', () => {
      const { getByTestId, store } = render(<GameScreen />);

      fireEvent.click(getByTestId('team1-wins-decrement'));
      expect(getByTestId('team1-wins')).toHaveTextContent('0');
    });
  });

  describe('Component Independence', () => {
    // Team name editing test removed - feature not available in landscape mode

    test('should maintain component isolation', () => {
      const { getByTestId, store } = render(<GameScreen />);

      // Increment score
      fireEvent.click(getByTestId('team1-score-area'));

      // Increment wins
      fireEvent.click(getByTestId('team1-wins-increment'));

      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
      expect(state.gameWins.team1).toBe(1);
      expect(state.scoreIncrement).toBe(1);
      expect(state.winCondition).toBe(10);
    });
  });
});
