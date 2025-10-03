import React from 'react';
import { render, fireEvent } from '../src/test-utils/test-utils';
import GameScreen from '../src/components/GameScreen';

// Set landscape mode for all tests in this file
beforeEach(() => {
  window.innerWidth = 800;
  window.innerHeight = 400;
});

describe('Core Scoring', () => {
  test('should display initial scores of 0-0', () => {
    const { getByTestId } = render(<GameScreen />);

    expect(getByTestId('team1-score')).toHaveTextContent('0');
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });

  test('should increment team score when clicked', () => {
    const { getByTestId } = render(<GameScreen />);

    fireEvent.click(getByTestId('team1-score-area'));
    expect(getByTestId('team1-score')).toHaveTextContent('1');

    fireEvent.click(getByTestId('team2-score-area'));
    expect(getByTestId('team2-score')).toHaveTextContent('1');
  });

  test('should decrement team score when minus button clicked', () => {
    const { getByTestId } = render(<GameScreen />, {
      preloadedState: {
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
      },
    });

    fireEvent.click(getByTestId('team1-decrement'));
    expect(getByTestId('team1-score')).toHaveTextContent('2');

    fireEvent.click(getByTestId('team2-decrement'));
    expect(getByTestId('team2-score')).toHaveTextContent('1');
  });

  test('should not allow negative scores', () => {
    const { getByTestId } = render(<GameScreen />, {
      preloadedState: {
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
      },
    });

    fireEvent.click(getByTestId('team1-decrement'));
    expect(getByTestId('team1-score')).toHaveTextContent('0');

    fireEvent.click(getByTestId('team2-decrement'));
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });

  test('should reset both scores to zero', () => {
    const { getByTestId } = render(<GameScreen />, {
      preloadedState: {
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
      },
    });

    fireEvent.click(getByTestId('reset-button'));
    expect(getByTestId('team1-score')).toHaveTextContent('0');
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });
});

describe('Visual Design Specification', () => {
  test('should display team 1 side with red background', () => {
    const { getByTestId } = render(<GameScreen />);

    const team1Side = getByTestId('team1-side');
    expect(team1Side).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  test('should display team 2 side with blue background', () => {
    const { getByTestId } = render(<GameScreen />);

    const team2Side = getByTestId('team2-side');
    expect(team2Side).toHaveStyle({ backgroundColor: '#0000FF' });
  });

  test('should display white text on colored backgrounds', () => {
    const { getByTestId } = render(<GameScreen />);

    // In landscape mode, only scores are displayed (no team names)
    expect(getByTestId('team1-score')).toHaveStyle({ color: '#FFFFFF' });
    expect(getByTestId('team2-score')).toHaveStyle({ color: '#FFFFFF' });
  });

  test('should have reset button in middle controls', () => {
    const { getByTestId } = render(<GameScreen />);

    const resetButton = getByTestId('reset-button');
    // Landscape mode reset button styles
    expect(resetButton).toHaveStyle({
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 28,
      width: 56,
      height: 56,
    });
  });

  // Team Name Editing Integration tests are skipped for landscape mode
  // as team names are not displayed in the minimalist landscape layout

  describe('Game Wins Tally Integration', () => {
    test('should display game wins tallies for both teams', () => {
      const { getByTestId } = render(<GameScreen />, {
        preloadedState: {
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
        },
      });

      // In landscape mode, testIDs are team1-wins and team2-wins
      expect(getByTestId('team1-wins')).toHaveTextContent('2');
      expect(getByTestId('team2-wins')).toHaveTextContent('1');
    });

    test('should display total game counter correctly', () => {
      const { getByTestId } = render(<GameScreen />, {
        preloadedState: {
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
        },
      });

      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('1 - 1');
    });

    test('should increment team wins when tally controls are used', () => {
      const { getByTestId } = render(<GameScreen />);

      // Increment team1 wins
      fireEvent.click(getByTestId('team1-wins-increment'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('1 - 0');

      // Increment team2 wins
      fireEvent.click(getByTestId('team2-wins-increment'));
      expect(getByTestId('team2-wins')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('1 - 1');
    });

    test('should decrement team wins when decrement buttons are used', () => {
      const { getByTestId } = render(<GameScreen />, {
        preloadedState: {
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
        },
      });

      // Decrement team1 wins
      fireEvent.click(getByTestId('team1-wins-decrement'));
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('1 - 1');

      // Decrement team2 wins
      fireEvent.click(getByTestId('team2-wins-decrement'));
      expect(getByTestId('team2-wins')).toHaveTextContent('0');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('1 - 0');
    });

    test('should preserve game wins when scores are reset', () => {
      const { getByTestId } = render(<GameScreen />, {
        preloadedState: {
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
        },
      });

      // Reset scores
      fireEvent.click(getByTestId('reset-button'));

      // Scores should be reset
      expect(getByTestId('team1-score')).toHaveTextContent('0');
      expect(getByTestId('team2-score')).toHaveTextContent('0');

      // Game wins should be preserved
      expect(getByTestId('team1-wins')).toHaveTextContent('2');
      expect(getByTestId('team2-wins')).toHaveTextContent('1');
      expect(getByTestId('landscape-tally-badge')).toHaveTextContent('2 - 1');
    });

    test('should maintain independence between scoring and tally systems', () => {
      const { getByTestId } = render(<GameScreen />);

      // Perform scoring operations
      fireEvent.click(getByTestId('team1-score-area'));
      fireEvent.click(getByTestId('team2-score-area'));
      fireEvent.click(getByTestId('team1-decrement'));

      // Perform tally operations
      fireEvent.click(getByTestId('team1-wins-increment'));
      fireEvent.click(getByTestId('team2-wins-increment'));

      // Check that both systems work independently
      expect(getByTestId('team1-score')).toHaveTextContent('0'); // 1 - 1 = 0
      expect(getByTestId('team2-score')).toHaveTextContent('1');
      expect(getByTestId('team1-wins')).toHaveTextContent('1');
      expect(getByTestId('team2-wins')).toHaveTextContent('1');
    });
  });
});