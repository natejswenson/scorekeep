import React from 'react';
import { render } from '../src/test-utils/test-utils';
import { Text } from 'react-native';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally - Inline Controls Layout', () => {
  const mockProps = {
    teamId: 'team1' as const,
    wins: 5,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inline Layout Structure', () => {
    test('should render controls in horizontal row layout', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        flexDirection: 'row',
        alignItems: 'center',
      });
    });

    test('should render decrement button, wins value, and increment button', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      expect(getByTestId('team1-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
      expect(getByTestId('team1-wins-increment-button')).toBeTruthy();
    });

    test('should render controls in correct order: decrement, value, increment', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const container = getByTestId('team1-wins-controls-container');
      const children = container.props.children;

      // Verify the order of children
      expect(children).toHaveLength(3);
      expect(children[0].props.testID).toBe('team1-wins-decrement-button');
      expect(children[1].props.testID).toBe('team1-wins-count');
      expect(children[2].props.testID).toBe('team1-wins-increment-button');
    });

    test('should display wins value centered between buttons', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const valueElement = getByTestId('team1-wins-count');
      expect(valueElement).toHaveStyle({
        textAlign: 'center',
      });
    });
  });

  describe('Width Constraint', () => {
    test('should constrain controls container width to not exceed label width', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const controlsContainer = getByTestId('team1-wins-controls-container');
      const label = getByTestId('team1-wins-label');

      // The controls container should have alignSelf center to constrain width
      expect(controlsContainer).toHaveStyle({
        alignSelf: 'center',
      });
    });

    test('should align controls container to center under label', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        alignSelf: 'center',
      });
    });
  });

  describe('Button Rendering', () => {
    test('should render decrement button with minus icon', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const decrementButton = getByTestId('team1-wins-decrement-button');
      const buttonText = getByTestId('team1-wins-decrement-text');

      expect(decrementButton).toBeTruthy();
      expect(buttonText).toHaveTextContent('-');
    });

    test('should render increment button with plus icon', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} />);

      const incrementButton = getByTestId('team1-wins-increment-button');
      const buttonText = getByTestId('team1-wins-increment-text');

      expect(incrementButton).toBeTruthy();
      expect(buttonText).toHaveTextContent('+');
    });

    test('should display current wins value', () => {
      const { getByTestId } = render(<TeamWinsTally {...mockProps} wins={7} />);

      const valueElement = getByTestId('team1-wins-count');
      expect(valueElement).toHaveTextContent('7');
    });
  });

  describe('Layout with Team 2', () => {
    test('should work correctly for team2', () => {
      const team2Props = {
        ...mockProps,
        teamId: 'team2' as const,
      };

      const { getByTestId } = render(<TeamWinsTally {...team2Props} />);

      expect(getByTestId('team2-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team2-wins-count')).toBeTruthy();
      expect(getByTestId('team2-wins-increment-button')).toBeTruthy();
    });
  });
});
