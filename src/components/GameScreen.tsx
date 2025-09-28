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
      {/* Team 1 - Red Side */}
      <View testID="team1-side" style={[styles.teamSide, styles.redSide]}>
        <Text testID="team1-name" style={styles.teamName}>{team1.name}</Text>
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

      {/* Team 2 - Blue Side */}
      <View testID="team2-side" style={[styles.teamSide, styles.blueSide]}>
        <Text testID="team2-name" style={styles.teamName}>{team2.name}</Text>
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

      {/* Reset Icon - Centered */}
      <TouchableOpacity
        testID="reset-button"
        style={styles.resetButton}
        onPress={() => dispatch(resetScores())}
      >
        <Text style={styles.resetIcon}>↻</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  teamSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  redSide: {
    backgroundColor: '#FF0000',
  },
  blueSide: {
    backgroundColor: '#0000FF',
  },
  teamName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  scoreArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  decrementButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  resetButton: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetIcon: {
    fontSize: 32,
    color: '#333333',
    fontWeight: 'bold',
  },
});

export default GameScreen;