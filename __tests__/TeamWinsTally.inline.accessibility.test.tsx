import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally - Inline Controls Touch Targets & Accessibility', () => {
  const mockProps = {
    teamId: 'team1' as const,
    wins: 5,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Touch Target Sizing', () => {
    test('should have minimum 44x44 touch target for decrement button', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      expect(decrementButton).toHaveStyle({
        minWidth: 44,
        minHeight: 44,
      });
    });

    test('should have minimum 44x44 touch target for increment button', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      expect(incrementButton).toHaveStyle({
        minWidth: 44,
        minHeight: 44,
      });
    });

    test('buttons should be square for consistent touch area', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      const incrementButton = getByTestId('team1-wins-increment-button');

      // Buttons should have equal minWidth and minHeight (44x44)
      expect(decrementButton).toHaveStyle({
        minWidth: 44,
        minHeight: 44,
      });

      expect(incrementButton).toHaveStyle({
        minWidth: 44,
        minHeight: 44,
      });
    });
  });

  describe('Accessibility Labels', () => {
    test('should have proper accessibility label for decrement button', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      expect(decrementButton).toHaveProp(
        'accessibilityLabel',
        'Decrement team 1 games won'
      );
    });

    test('should have proper accessibility label for increment button', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      expect(incrementButton).toHaveProp(
        'accessibilityLabel',
        'Increment team 1 games won'
      );
    });

    test('should have button accessibility role for decrement', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      expect(decrementButton).toHaveProp('accessibilityRole', 'button');
    });

    test('should have button accessibility role for increment', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      expect(incrementButton).toHaveProp('accessibilityRole', 'button');
    });

    test('should update accessibility labels for team2', () => {
      const team2Props = {
        ...mockProps,
        teamId: 'team2' as const,
      };

      const { getByTestId } = render(<TeamWinsTally {...team2Props} />);

      expect(getByTestId('team2-wins-decrement-button')).toHaveProp(
        'accessibilityLabel',
        'Decrement team 2 games won'
      );
      expect(getByTestId('team2-wins-increment-button')).toHaveProp(
        'accessibilityLabel',
        'Increment team 2 games won'
      );
    });
  });

  describe('Button Interactions', () => {
    test('should call onDecrement when decrement button is pressed', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      fireEvent.press(decrementButton);

      expect(mockProps.onDecrement).toHaveBeenCalledTimes(1);
    });

    test('should call onIncrement when increment button is pressed', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      fireEvent.press(incrementButton);

      expect(mockProps.onIncrement).toHaveBeenCalledTimes(1);
    });

    test('should handle multiple rapid presses on increment', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);

      expect(mockProps.onIncrement).toHaveBeenCalledTimes(3);
    });

    test('should handle multiple rapid presses on decrement', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      fireEvent.press(decrementButton);
      fireEvent.press(decrementButton);
      fireEvent.press(decrementButton);

      expect(mockProps.onDecrement).toHaveBeenCalledTimes(3);
    });
  });

  describe('Spacing and Layout', () => {
    test('should have adequate spacing between controls', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const valueElement = getByTestId('team1-wins-count');

      // Value should have horizontal margins for spacing
      expect(valueElement).toHaveStyle({
        marginHorizontal: 8,
      });
    });

    test('should center buttons vertically', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      const incrementButton = getByTestId('team1-wins-increment-button');

      expect(decrementButton).toHaveStyle({
        justifyContent: 'center',
        alignItems: 'center',
      });

      expect(incrementButton).toHaveStyle({
        justifyContent: 'center',
        alignItems: 'center',
      });
    });
  });

  describe('Edge Cases', () => {
    test('should display zero wins correctly', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} wins={0} />);

      expect(getByTestId('team1-wins-count')).toHaveTextContent('0');
    });

    test('should display large win counts correctly', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} wins={99} />);

      expect(getByTestId('team1-wins-count')).toHaveTextContent('99');
    });

    test('should display triple digit win counts', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} wins={123} />);

      expect(getByTestId('team1-wins-count')).toHaveTextContent('123');
    });
  });
});
