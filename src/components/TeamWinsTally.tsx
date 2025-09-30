import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Reduced margin for tighter vertical spacing in landscape mode
const TALLY_MARGIN_TOP = 8;

// Landscape positioning: offset from left/right edges
const LANDSCAPE_TALLY_OFFSET = 10;

/**
 * Displays the number of games won by a team
 *
 * Position behavior:
 * - Portrait mode: Positioned at bottom of team section (default flow)
 * - Landscape mode: Absolutely positioned on left (team1) or right (team2) side,
 *   vertically centered for better space utilization
 */
interface TeamWinsTallyProps {
  teamId: 'team1' | 'team2';
  wins: number;
  isLandscape?: boolean;
}

const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  isLandscape = false,
}) => {
  const getAccessibilityLabel = () => {
    const teamName = teamId === 'team1' ? 'Team 1' : 'Team 2';
    const gameText = wins === 1 ? 'game' : 'games';
    return `${teamName} ${gameText} won: ${wins}`;
  };

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
      <Text
        testID={`${teamId}-wins-count`}
        style={styles.tallyCount}
      >
        {wins}
      </Text>
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
  tallyCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TeamWinsTally;