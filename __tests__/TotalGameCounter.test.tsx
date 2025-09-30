import React from 'react';
import { render } from '@testing-library/react-native';
import TotalGameCounter from '../src/components/TotalGameCounter';

describe('TotalGameCounter Component', () => {
  describe('Total games calculation', () => {
    test('should display "1" when both teams have 0 wins', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');
    });

    test('should display "3" when team1=1 and team2=1', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={3} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('3');
    });

    test('should handle various total game counts', () => {
      const testCases = [
        { total: 1, expected: '1' },
        { total: 5, expected: '5' },
        { total: 10, expected: '10' },
        { total: 25, expected: '25' },
      ];

      testCases.forEach(({ total, expected }) => {
        const { getByTestId } = render(
          <TotalGameCounter totalGames={total} />
        );
        expect(getByTestId('total-game-counter')).toHaveTextContent(expected);
      });
    });

    test('should handle edge case of 0 total games', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={0} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('0');
    });
  });

  describe('Visual design', () => {
    test('should display "Game" label', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-label')).toHaveTextContent('Game');
    });

    test('should have prominent styling for visibility', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={5} />
      );

      expect(getByTestId('total-game-counter')).toHaveStyle({
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
      });
    });

    test('should have centered layout', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-container')).toHaveStyle({
        alignItems: 'center',
        marginBottom: 10,
      });
    });

    test('should have appropriate label styling', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-label')).toHaveStyle({
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper accessibility label for single game', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-container')).toHaveProp(
        'accessibilityLabel',
        'Game 1 of match'
      );
    });

    test('should have proper accessibility label for multiple games', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={5} />
      );

      expect(getByTestId('total-game-container')).toHaveProp(
        'accessibilityLabel',
        'Game 5 of match'
      );
    });

    test('should have semantic accessibility role', () => {
      const { getByTestId } = render(
        <TotalGameCounter totalGames={3} />
      );

      expect(getByTestId('total-game-container')).toHaveProp(
        'accessibilityRole',
        'text'
      );
    });
  });

  describe('Component behavior', () => {
    test('should update when totalGames prop changes', () => {
      const { getByTestId, rerender } = render(
        <TotalGameCounter totalGames={1} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');

      rerender(<TotalGameCounter totalGames={7} />);

      expect(getByTestId('total-game-counter')).toHaveTextContent('7');
    });

    test('should maintain consistent layout across different values', () => {
      const { getByTestId, rerender } = render(
        <TotalGameCounter totalGames={1} />
      );

      const initialStyle = getByTestId('total-game-container').props.style;

      rerender(<TotalGameCounter totalGames={99} />);

      const updatedStyle = getByTestId('total-game-container').props.style;
      expect(updatedStyle).toEqual(initialStyle);
    });
  });
});