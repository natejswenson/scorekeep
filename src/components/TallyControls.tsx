import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TotalGameCounter from './TotalGameCounter';

interface TallyControlsProps {
  team1Wins: number;
  team2Wins: number;
  onIncrementTeam1: () => void;
  onDecrementTeam1: () => void;
  onIncrementTeam2: () => void;
  onDecrementTeam2: () => void;
}

const TallyControls: React.FC<TallyControlsProps> = ({
  team1Wins,
  team2Wins,
  onIncrementTeam1,
  onDecrementTeam1,
  onIncrementTeam2,
  onDecrementTeam2,
}) => {
  const totalGames = team1Wins + team2Wins + 1;

  return (
    <View testID="tally-controls-container" style={styles.controlsContainer}>
      <View style={styles.teamControls}>
        <TouchableOpacity
          testID="team1-wins-decrement"
          onPress={onDecrementTeam1}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team1-wins-increment"
          onPress={onIncrementTeam1}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TotalGameCounter totalGames={totalGames} />

      <View style={styles.teamControls}>
        <TouchableOpacity
          testID="team2-wins-decrement"
          onPress={onDecrementTeam2}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team2-wins-increment"
          onPress={onIncrementTeam2}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  teamControls: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});

export default TallyControls;
