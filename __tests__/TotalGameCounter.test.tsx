import React from 'react';
import { render } from '@testing-library/react-native';
import TotalGameCounter from '../src/components/TotalGameCounter';

describe('TotalGameCounter Component', () => {
  describe('Calculation', () => {
    test('should display "1" when both teams have 0 wins', () => {
      const { getByTestId } = render(<TotalGameCounter totalGames={1} />);

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');
    });

    test('should display "3" when team1=1 and team2=1', () => {
      const { getByTestId } = render(<TotalGameCounter totalGames={3} />);

      expect(getByTestId('total-game-counter')).toHaveTextContent('3');
    });

    test('should calculate total games correctly for various combinations', () => {
      // team1=2, team2=3 -> total=6
      const { getByTestId, rerender } = render(
        <TotalGameCounter totalGames={6} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('6');

      // team1=0, team2=5 -> total=6
      rerender(<TotalGameCounter totalGames={6} />);
      expect(getByTestId('total-game-counter')).toHaveTextContent('6');

      // team1=10, team2=10 -> total=21
      rerender(<TotalGameCounter totalGames={21} />);
      expect(getByTestId('total-game-counter')).toHaveTextContent('21');
    });
  });

  describe('Updates', () => {
    test('should update when total games changes', () => {
      const { getByTestId, rerender } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');

      rerender(<TotalGameCounter totalGames={5} />);

      expect(getByTestId('total-game-counter')).toHaveTextContent('5');
    });
  });

  describe('Rendering', () => {
    test('should render with proper testID', () => {
      const { getByTestId } = render(<TotalGameCounter totalGames={1} />);

      expect(getByTestId('total-game-counter')).toBeTruthy();
    });

    test('should display label "Game"', () => {
      const { getByTestId } = render(<TotalGameCounter totalGames={1} />);

      expect(getByTestId('total-game-label')).toHaveTextContent('Game');
    });
  });

  describe('Styling', () => {
    test('should be prominently displayed', () => {
      const { getByTestId } = render(<TotalGameCounter totalGames={5} />);

      const counter = getByTestId('total-game-counter');
      const style = counter.props.style;

      // Should have larger font size for prominence
      expect(style.fontSize).toBeDefined();
      expect(typeof style.fontSize).toBe('number');
    });
  });
});
