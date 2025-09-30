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
  return (
    <View testID={`${teamId}-wins-tally-container`} style={styles.tallyContainer}>
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
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  tallyCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TeamWinsTally;
