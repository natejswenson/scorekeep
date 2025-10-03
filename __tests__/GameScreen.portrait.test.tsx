import React from 'react';
import { render, fireEvent } from '../src/test-utils/test-utils';
import GameScreen from '../src/components/GameScreen';

// Set portrait mode for all tests in this file
beforeEach(() => {
  window.innerWidth = 375;
  window.innerHeight = 812;
});

describe('GameScreen Portrait Mode', () => {
  it('should increment team 1 score when card score area is tapped', () => {
    const { getByTestId } = render(<GameScreen />);

    fireEvent.click(getByTestId('team1-score-area'));
    expect(getByTestId('team1-score')).toHaveTextContent('1');
  });

  it('should decrement team 1 score when decrement button is pressed', () => {
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

    fireEvent.click(getByTestId('team1-decrement'));
    expect(getByTestId('team1-score')).toHaveTextContent('4');
  });

  it('should increment team wins when wins increment button is pressed', () => {
    const { getByTestId } = render(<GameScreen />);

    fireEvent.click(getByTestId('team1-wins-increment'));
    expect(getByTestId('team1-wins')).toHaveTextContent('1');
  });

  it('should decrement team wins when wins decrement button is pressed', () => {
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
          gameWins: { team1: 3, team2: 2 },
        },
      },
    });

    fireEvent.click(getByTestId('team1-wins-decrement'));
    expect(getByTestId('team1-wins')).toHaveTextContent('2');
  });


  it('should increment team 2 score in portrait mode', () => {
    const { getByTestId } = render(<GameScreen />);

    fireEvent.click(getByTestId('team2-score-area'));
    expect(getByTestId('team2-score')).toHaveTextContent('1');
  });

  it('should decrement team 2 score in portrait mode', () => {
    const { getByTestId } = render(<GameScreen />, {
      preloadedState: {
        game: {
          team1: { name: 'Team 1', score: 2, color: '#FF0000' },
          team2: { name: 'Team 2', score: 5, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 0, team2: 0 },
        },
      },
    });

    fireEvent.click(getByTestId('team2-decrement'));
    expect(getByTestId('team2-score')).toHaveTextContent('4');
  });

  it('should increment team 2 wins in portrait mode', () => {
    const { getByTestId } = render(<GameScreen />);

    fireEvent.click(getByTestId('team2-wins-increment'));
    expect(getByTestId('team2-wins')).toHaveTextContent('1');
  });

  it('should decrement team 2 wins in portrait mode', () => {
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
          gameWins: { team1: 1, team2: 4 },
        },
      },
    });

    fireEvent.click(getByTestId('team2-wins-decrement'));
    expect(getByTestId('team2-wins')).toHaveTextContent('3');
  });


  it('should reset scores when reset button is pressed', () => {
    const { getByTestId } = render(<GameScreen />, {
      preloadedState: {
        game: {
          team1: { name: 'Team 1', score: 7, color: '#FF0000' },
          team2: { name: 'Team 2', score: 5, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 1 },
        },
      },
    });

    fireEvent.click(getByTestId('reset-button'));
    expect(getByTestId('team1-score')).toHaveTextContent('0');
    expect(getByTestId('team2-score')).toHaveTextContent('0');
  });
});
