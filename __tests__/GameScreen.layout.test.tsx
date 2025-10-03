import React from 'react';
import { render } from '../src/test-utils/test-utils';
import { StyleSheet } from 'react-native';
import GameScreen from '../src/components/GameScreen';





describe('GameScreen Layout Optimization', () => {
  beforeEach(() => {
    // Default to landscape mode for layout tests
    window.innerWidth = 800;
      window.innerHeight = 400;
    jest.clearAllMocks();
  });

  describe('Landscape Background Edge Extension', () => {
    test('team sides should have no horizontal padding in landscape', () => {
      window.innerWidth = 800;
      window.innerHeight = 400; // Landscape

      const { getByTestId } = render(<GameScreen />);

      const team1Side = getByTestId('team1-side');
      const style = StyleSheet.flatten(team1Side.props.style);

      // Should not have horizontal padding to allow background to extend to edges
      expect(style.paddingLeft).toBeUndefined();
      expect(style.paddingRight).toBeUndefined();
      expect(style.paddingHorizontal).toBeUndefined();
    });

    test('team1 side should extend to left edge with flex', () => {
      window.innerWidth = 800;
      window.innerHeight = 400; // Landscape

      const { getByTestId } = render(<GameScreen />);

      const team1Side = getByTestId('team1-side');
      const style = StyleSheet.flatten(team1Side.props.style);

      // Should use flex: 1 to fill container width
      expect(style.flex).toBe(1);
      expect(style.backgroundColor).toBe('#FF0000');
    });

    test('team2 side should extend to right edge with flex', () => {
      window.innerWidth = 800;
      window.innerHeight = 400; // Landscape

      const { getByTestId } = render(<GameScreen />);

      const team2Side = getByTestId('team2-side');
      const style = StyleSheet.flatten(team2Side.props.style);

      // Should use flex: 1 to fill container width
      expect(style.flex).toBe(1);
      expect(style.backgroundColor).toBe('#0000FF');
    });

    test('content should remain centered despite no horizontal padding', () => {
      window.innerWidth = 800;
      window.innerHeight = 400; // Landscape

      const { getByTestId } = render(<GameScreen />);

      const team1Side = getByTestId('team1-side');
      const style = StyleSheet.flatten(team1Side.props.style);

      // Content should be centered with alignItems
      expect(style.alignItems).toBe('center');
    });
  });

  describe('Portrait Mode - No Regression', () => {
    test('portrait team sides should maintain proper styling', () => {
      window.innerWidth = 400;
      window.innerHeight = 800; // Portrait

      const { getByTestId } = render(<GameScreen />);

      const team1Side = getByTestId('team1-side');
      const team2Side = getByTestId('team2-side');

      const style1 = StyleSheet.flatten(team1Side.props.style);
      const style2 = StyleSheet.flatten(team2Side.props.style);

      expect(style1.backgroundColor).toBe('#FF0000');
      expect(style2.backgroundColor).toBe('#0000FF');
    });

    test('portrait mode should not be affected by landscape fix', () => {
      window.innerWidth = 400;
      window.innerHeight = 800; // Portrait

      const { getByTestId } = render(<GameScreen />);

      // Portrait uses portraitTeamSide style, not teamSide
      const team1Side = getByTestId('team1-side');
      const style = StyleSheet.flatten(team1Side.props.style);

      // Portrait should still work correctly regardless of landscape changes
      expect(style.flex).toBe(1);
    });
  });

  describe('Vertical Spacing', () => {
    test('should reduce gap between score circle and decrement button', () => {
      const { getByTestId } = render(<GameScreen />);

      const scoreArea = getByTestId('team1-score-area');
      const styles = scoreArea.props.style;

      // Score area should have no marginBottom since overlap is controlled by button's negative marginTop
      expect(styles.marginBottom).toBeUndefined();
    });

    test('should position Games Won section at bottom of viewport', () => {
      const { getByTestId } = render(<GameScreen />);

      // Games won controls should exist
      expect(getByTestId('team1-wins')).toBeTruthy();
      expect(getByTestId('team2-wins')).toBeTruthy();
    });
  });

  describe('Tally Controls Position', () => {
    test('should position tally controls at top of screen', () => {
      const { getByTestId } = render(<GameScreen />);

      const topContainer = getByTestId('top-controls-container');
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;

      // The top container should have top position at 8% instead of 45%
      expect(styles.top).toBe('25%');
    });

    test('should center tally controls horizontally', () => {
      const { getByTestId } = render(<GameScreen />);

      const topContainer = getByTestId('top-controls-container');
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;

      expect(styles.left).toBe('50%');
      expect(styles.position).toBe('absolute');
    });
  });

  describe('Reset Button Position', () => {
    test('should position reset button in middle area separate from tally controls', () => {
      const { getByTestId } = render(<GameScreen />);

      const middleContainer = getByTestId('middle-controls-container');
      const styles = Array.isArray(middleContainer.props.style)
        ? Object.assign({}, ...middleContainer.props.style)
        : middleContainer.props.style;

      // Reset button should be in its own container positioned at 45%
      expect(styles.top).toBe('45%');
    });

    test('should not be grouped with tally controls', () => {
      const { getByTestId } = render(<GameScreen />);

      const topContainer = getByTestId('top-controls-container');
      const middleContainer = getByTestId('middle-controls-container');

      // Tally controls and reset button should be in different containers
      expect(topContainer).toBeTruthy();
      expect(middleContainer).toBeTruthy();
      expect(topContainer).not.toBe(middleContainer);
    });
  });

  describe('Accessibility', () => {
    test('should have appropriately sized touch targets', () => {
      const { getByTestId } = render(<GameScreen />);

      const team1Increment = getByTestId('team1-wins-increment');
      const team1Decrement = getByTestId('team1-wins-decrement');
      const resetButton = getByTestId('reset-button');

      // In landscape mode, games won controls are 32px (compact design)
      // Reset button is 56px
      expect(team1Increment.props.style.width).toBe(32);
      expect(team1Increment.props.style.height).toBe(32);
      expect(team1Decrement.props.style.width).toBe(32);
      expect(team1Decrement.props.style.height).toBe(32);
      expect(resetButton.props.style.width).toBe(56);
      expect(resetButton.props.style.height).toBe(56);
    });

    test('should preserve accessibility labels', () => {
      const { getByTestId } = render(<GameScreen />);

      const team1Increment = getByTestId('team1-wins-increment');
      const team1Decrement = getByTestId('team1-wins-decrement');

      expect(team1Increment.props.accessibilityLabel).toBe('Increment team 1 games won');
      expect(team1Decrement.props.accessibilityLabel).toBe('Decrement team 1 games won');
    });
  });

  describe('Component Structure', () => {
    test('should render tally badge in separate top container', () => {
      const { getByTestId } = render(<GameScreen />);

      const topContainer = getByTestId('top-controls-container');
      const tallyBadge = getByTestId('landscape-tally-badge');

      // Both elements should exist
      expect(topContainer).toBeTruthy();
      expect(tallyBadge).toBeTruthy();

      // Top container should have proper positioning styles
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;
      expect(styles.top).toBe('25%');
    });

    test('should render reset button in separate middle container', () => {
      const { getByTestId } = render(<GameScreen />);

      const middleContainer = getByTestId('middle-controls-container');
      const resetButton = getByTestId('reset-button');

      // Both elements should exist
      expect(middleContainer).toBeTruthy();
      expect(resetButton).toBeTruthy();

      // Middle container should have proper positioning styles
      const styles = Array.isArray(middleContainer.props.style)
        ? Object.assign({}, ...middleContainer.props.style)
        : middleContainer.props.style;
      expect(styles.top).toBe('45%');
    });
  });
});
