import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
} from '../store/gameSlice';

const GameScreen: React.FC = () => {
  const { team1, team2 } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {/* Team 1 */}
      <View style={styles.teamContainer}>
        <Text style={styles.teamName}>{team1.name}</Text>
        <TouchableOpacity
          testID="team1-score-area"
          style={styles.scoreArea}
          onPress={() => dispatch(incrementTeam1Score())}
        >
          <Text testID="team1-score" style={styles.score}>
            {team1.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team1-decrement"
          style={styles.decrementButton}
          onPress={() => dispatch(decrementTeam1Score())}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      {/* Team 2 */}
      <View style={styles.teamContainer}>
        <Text style={styles.teamName}>{team2.name}</Text>
        <TouchableOpacity
          testID="team2-score-area"
          style={styles.scoreArea}
          onPress={() => dispatch(incrementTeam2Score())}
        >
          <Text testID="team2-score" style={styles.score}>
            {team2.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team2-decrement"
          style={styles.decrementButton}
          onPress={() => dispatch(decrementTeam2Score())}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        testID="reset-button"
        style={styles.resetButton}
        onPress={() => dispatch(resetScores())}
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreArea: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  decrementButton: {
    width: 50,
    height: 50,
    backgroundColor: '#ff4444',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetButton: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;