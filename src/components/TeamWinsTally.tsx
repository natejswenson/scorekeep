import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TeamWinsTallyProps {
  teamId: 'team1' | 'team2';
  wins: number;
  teamColor: string;
}

const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  teamColor,
}) => {
  const getAccessibilityLabel = () => {
    const teamName = teamId === 'team1' ? 'Team 1' : 'Team 2';
    const gameText = wins === 1 ? 'game' : 'games';
    return `${teamName} ${gameText} won: ${wins}`;
  };

  return (
    <View
      testID={`${teamId}-wins-container`}
      style={styles.tallyContainer}
      accessibilityLabel={getAccessibilityLabel()}
    >
      <Text
        testID={`${teamId}-wins-label`}
        style={[styles.tallyLabel, { color: teamColor }]}
      >
        Games Won
      </Text>
      <Text
        testID={`${teamId}-wins-count`}
        style={[styles.tallyCount, { color: teamColor }]}
      >
        {wins}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tallyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  tallyLabel: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 4,
  },
  tallyCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TeamWinsTally;