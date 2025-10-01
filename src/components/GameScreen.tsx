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
  setEditingTeam,
  updateTeamName,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
} from '../store/gameSlice';
import TeamNameDisplay from './TeamNameDisplay';
import TeamWinsTally from './TeamWinsTally';
import TallyControls from './TallyControls';
import { useIsLandscape } from '../hooks/useOrientation';

// Layout constants for optimized spacing in landscape mode
const LAYOUT_CONSTANTS = {
  SCORE_AREA_MARGIN_BOTTOM: 10, // Reduced from 40 to bring elements closer
  TOP_CONTROLS_POSITION: '8%' as const, // Tally controls positioned at top
  MIDDLE_CONTROLS_POSITION: '45%' as const, // Reset button stays in middle
  DECREMENT_BUTTON_SIZE: 60,
  BUTTON_OVERLAP_PERCENTAGE: 0.45, // 45% overlap for tighter visual grouping
  BUTTON_OVERLAP_OFFSET: -27, // -(60 * 0.45) = -27px overlap
};

const GameScreen: React.FC = () => {
  const { team1, team2, editingTeam, gameWins } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const isLandscape = useIsLandscape();

  const handleStartEdit = (teamId: 'team1' | 'team2') => {
    dispatch(setEditingTeam(teamId));
  };

  const handleSaveName = (teamId: 'team1' | 'team2', name: string) => {
    dispatch(updateTeamName({ team: teamId, name }));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingTeam(null));
  };

  const handleIncrementTeam1Wins = () => {
    dispatch(incrementTeam1Wins());
  };

  const handleIncrementTeam2Wins = () => {
    dispatch(incrementTeam2Wins());
  };

  const handleDecrementTeam1Wins = () => {
    dispatch(decrementTeam1Wins());
  };

  const handleDecrementTeam2Wins = () => {
    dispatch(decrementTeam2Wins());
  };

  return (
    <View style={styles.container}>
      {/* Team 1 - Red Side */}
      <View testID="team1-side" style={[styles.teamSide, styles.redSide]}>
        <TeamNameDisplay
          teamId="team1"
          name={team1.name}
          isEditing={editingTeam === 'team1'}
          onStartEdit={handleStartEdit}
          onSaveName={handleSaveName}
          onCancelEdit={handleCancelEdit}
        />
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
        <TeamWinsTally
          teamId="team1"
          wins={gameWins.team1}
          isLandscape={isLandscape}
          onIncrement={handleIncrementTeam1Wins}
          onDecrement={handleDecrementTeam1Wins}
        />
      </View>

      {/* Team 2 - Blue Side */}
      <View testID="team2-side" style={[styles.teamSide, styles.blueSide]}>
        <TeamNameDisplay
          teamId="team2"
          name={team2.name}
          isEditing={editingTeam === 'team2'}
          onStartEdit={handleStartEdit}
          onSaveName={handleSaveName}
          onCancelEdit={handleCancelEdit}
        />
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
        <TeamWinsTally
          teamId="team2"
          wins={gameWins.team2}
          isLandscape={isLandscape}
          onIncrement={handleIncrementTeam2Wins}
          onDecrement={handleDecrementTeam2Wins}
        />
      </View>

      {/* Top Controls - Total Game Counter */}
      <View testID="top-controls-container" style={styles.topControls}>
        <TallyControls
          team1Wins={gameWins.team1}
          team2Wins={gameWins.team2}
        />
      </View>

      {/* Middle Controls - Reset Button in middle area */}
      <View testID="middle-controls-container" style={styles.middleControls}>
        <TouchableOpacity
          testID="reset-button"
          style={styles.resetButton}
          onPress={() => dispatch(resetScores())}
        >
          <Text style={styles.resetIcon}>↻</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
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
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 2, // Higher z-index to appear above decrement button
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  decrementButton: {
    width: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
    height: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1, // Lower z-index to appear behind score circle
    marginTop: LAYOUT_CONSTANTS.BUTTON_OVERLAP_OFFSET, // Negative margin for 20% overlap
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  topControls: {
    position: 'absolute',
    left: '50%',
    top: LAYOUT_CONSTANTS.TOP_CONTROLS_POSITION,
    transform: [{ translateX: -75 }, { translateY: -50 }],
    alignItems: 'center',
    width: 150,
    zIndex: 10, // Ensure tally controls appear above other elements
  },
  middleControls: {
    position: 'absolute',
    left: '50%',
    top: LAYOUT_CONSTANTS.MIDDLE_CONTROLS_POSITION,
    transform: [{ translateX: -35 }, { translateY: -35 }],
    alignItems: 'center',
  },
  resetButton: {
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