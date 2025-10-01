import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Reduced margin for tighter vertical spacing in landscape mode
const TALLY_MARGIN_TOP = 8;

// Landscape positioning: offset from left/right edges
const LANDSCAPE_TALLY_OFFSET = 10;

// Touch target minimum size for accessibility
const BUTTON_SIZE = 44;

// Spacing between controls
const CONTROL_SPACING = 8;

/**
 * Displays the number of games won by a team with inline increment/decrement controls
 *
 * Layout:
 * - Label: "Games Won" text displayed above controls
 * - Controls: Inline layout with decrement button (-), wins count, and increment button (+)
 * - Width constraint: Control group width never exceeds label width for visual alignment
 *
 * Position behavior:
 * - Portrait mode: Positioned at bottom of team section (default flow)
 * - Landscape mode: Absolutely positioned on left (team1) or right (team2) side,
 *   vertically centered for better space utilization
 *
 * Accessibility:
 * - Minimum 44x44 touch targets for buttons
 * - Proper accessibility labels and roles for screen readers
 * - High contrast white text on team color backgrounds
 */
interface TeamWinsTallyProps {
  /** Team identifier: 'team1' (red) or 'team2' (blue) */
  teamId: 'team1' | 'team2';
  /** Number of games won by the team */
  wins: number;
  /** Whether device is in landscape orientation */
  isLandscape?: boolean;
  /** Handler called when increment button is pressed */
  onIncrement?: () => void;
  /** Handler called when decrement button is pressed */
  onDecrement?: () => void;
}

const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  isLandscape = false,
  onIncrement,
  onDecrement,
}) => {
  const getAccessibilityLabel = () => {
    const teamName = teamId === 'team1' ? 'Team 1' : 'Team 2';
    const gameText = wins === 1 ? 'game' : 'games';
    return `${teamName} ${gameText} won: ${wins}`;
  };

  const teamNumber = teamId === 'team1' ? '1' : '2';

  // Apply landscape-specific positioning
  const landscapeStyles = isLandscape ? {
    position: 'absolute' as const,
    top: '50%' as const,
    [teamId === 'team1' ? 'left' : 'right']: LANDSCAPE_TALLY_OFFSET,
    transform: [{ translateY: -40 }],
  } : {};

  return (
    <View
      testID={`${teamId}-wins-container`}
      style={[styles.tallyContainer, landscapeStyles]}
      accessibilityLabel={getAccessibilityLabel()}
    >
      <Text
        testID={`${teamId}-wins-label`}
        style={styles.tallyLabel}
      >
        Games Won
      </Text>
      <View
        testID={`${teamId}-wins-controls-container`}
        style={styles.controlsContainer}
      >
        <TouchableOpacity
          testID={`${teamId}-wins-decrement-button`}
          style={styles.controlButton}
          onPress={onDecrement}
          accessibilityLabel={`Decrement team ${teamNumber} games won`}
          accessibilityRole="button"
        >
          <Text
            testID={`${teamId}-wins-decrement-text`}
            style={styles.buttonText}
          >
            -
          </Text>
        </TouchableOpacity>
        <Text
          testID={`${teamId}-wins-count`}
          style={styles.tallyCount}
        >
          {wins}
        </Text>
        <TouchableOpacity
          testID={`${teamId}-wins-increment-button`}
          style={styles.controlButton}
          onPress={onIncrement}
          accessibilityLabel={`Increment team ${teamNumber} games won`}
          accessibilityRole="button"
        >
          <Text
            testID={`${teamId}-wins-increment-text`}
            style={styles.buttonText}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tallyContainer: {
    alignItems: 'center',
    marginTop: TALLY_MARGIN_TOP,
  },
  tallyLabel: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  controlButton: {
    minWidth: BUTTON_SIZE,
    minHeight: BUTTON_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  tallyCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: CONTROL_SPACING,
  },
});

export default TeamWinsTally;