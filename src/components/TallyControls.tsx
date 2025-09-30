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
      {/* Team 1 Controls */}
      <View testID="team1-controls" style={styles.teamControls}>
        <TouchableOpacity
          testID="team1-decrement-button"
          style={styles.controlButton}
          onPress={onDecrementTeam1}
          accessibilityLabel="Decrement team 1 wins"
          accessibilityRole="button"
        >
          <Text testID="team1-decrement-text" style={styles.buttonText}>
            -
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team1-increment-button"
          style={styles.controlButton}
          onPress={onIncrementTeam1}
          accessibilityLabel="Increment team 1 wins"
          accessibilityRole="button"
        >
          <Text testID="team1-increment-text" style={styles.buttonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total Game Counter */}
      <TotalGameCounter totalGames={totalGames} />

      {/* Team 2 Controls */}
      <View testID="team2-controls" style={styles.teamControls}>
        <TouchableOpacity
          testID="team2-decrement-button"
          style={styles.controlButton}
          onPress={onDecrementTeam2}
          accessibilityLabel="Decrement team 2 wins"
          accessibilityRole="button"
        >
          <Text testID="team2-decrement-text" style={styles.buttonText}>
            -
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team2-increment-button"
          style={styles.controlButton}
          onPress={onIncrementTeam2}
          accessibilityLabel="Increment team 2 wins"
          accessibilityRole="button"
        >
          <Text testID="team2-increment-text" style={styles.buttonText}>
            +
          </Text>
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
  },
  teamControls: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  controlButton: {
    minWidth: 44,
    minHeight: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  buttonText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
});

export default TallyControls;