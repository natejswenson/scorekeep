import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
  updateTeam1,
  updateTeam2,
  setEditingTeam,
  updateTeamName,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
  resetGameWins,
} from '../src/store/gameSlice';
import { GameState } from '../src/types';

describe('gameSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        game: gameReducer,
      },
    });
  });

  describe('score increment actions', () => {
    test('should increment team1 score by scoreIncrement', () => {
      store.dispatch(incrementTeam1Score());
      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
    });

    test('should increment team2 score by scoreIncrement', () => {
      store.dispatch(incrementTeam2Score());
      const state = store.getState().game;
      expect(state.team2.score).toBe(1);
    });
  });

  describe('score decrement actions', () => {
    test('should decrement team1 score when score is positive', () => {
      // First increment to have a positive score
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam1Score());
      store.dispatch(decrementTeam1Score());

      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
    });

    test('should decrement team2 score when score is positive', () => {
      // First increment to have a positive score
      store.dispatch(incrementTeam2Score());
      store.dispatch(incrementTeam2Score());
      store.dispatch(decrementTeam2Score());

      const state = store.getState().game;
      expect(state.team2.score).toBe(1);
    });

    test('should not decrement team1 score below zero', () => {
      store.dispatch(decrementTeam1Score());
      const state = store.getState().game;
      expect(state.team1.score).toBe(0);
    });

    test('should not decrement team2 score below zero', () => {
      store.dispatch(decrementTeam2Score());
      const state = store.getState().game;
      expect(state.team2.score).toBe(0);
    });
  });

  describe('reset scores action', () => {
    test('should reset both team scores to zero', () => {
      // Set some scores first
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam2Score());
      store.dispatch(incrementTeam2Score());

      // Reset scores
      store.dispatch(resetScores());

      const state = store.getState().game;
      expect(state.team1.score).toBe(0);
      expect(state.team2.score).toBe(0);
      expect(state.isGameActive).toBe(true);
      expect(state.winner).toBe(null);
    });
  });

  describe('team update actions', () => {
    test('should update team1 properties', () => {
      store.dispatch(updateTeam1({ name: 'New Team 1', color: '#00FF00' }));
      const state = store.getState().game;
      expect(state.team1.name).toBe('New Team 1');
      expect(state.team1.color).toBe('#00FF00');
      expect(state.team1.score).toBe(0); // Should maintain existing score
    });

    test('should update team2 properties', () => {
      store.dispatch(updateTeam2({ name: 'New Team 2', color: '#FFFF00' }));
      const state = store.getState().game;
      expect(state.team2.name).toBe('New Team 2');
      expect(state.team2.color).toBe('#FFFF00');
      expect(state.team2.score).toBe(0); // Should maintain existing score
    });

    test('should partially update team1 properties', () => {
      store.dispatch(updateTeam1({ name: 'Updated Team 1' }));
      const state = store.getState().game;
      expect(state.team1.name).toBe('Updated Team 1');
      expect(state.team1.color).toBe('#FF0000'); // Should maintain original color
    });

    test('should partially update team2 properties', () => {
      store.dispatch(updateTeam2({ color: '#PURPLE' }));
      const state = store.getState().game;
      expect(state.team2.name).toBe('Team 2'); // Should maintain original name
      expect(state.team2.color).toBe('#PURPLE');
    });
  });

  describe('editing state management', () => {
    test('should set editing team to team1', () => {
      store.dispatch(setEditingTeam('team1'));
      const state = store.getState().game;
      expect(state.editingTeam).toBe('team1');
    });

    test('should set editing team to team2', () => {
      store.dispatch(setEditingTeam('team2'));
      const state = store.getState().game;
      expect(state.editingTeam).toBe('team2');
    });

    test('should clear editing team when set to null', () => {
      store.dispatch(setEditingTeam('team1'));
      store.dispatch(setEditingTeam(null));
      const state = store.getState().game;
      expect(state.editingTeam).toBe(null);
    });

    test('should only allow editing one team at a time', () => {
      store.dispatch(setEditingTeam('team1'));
      store.dispatch(setEditingTeam('team2'));
      const state = store.getState().game;
      expect(state.editingTeam).toBe('team2');
    });
  });

  describe('team name update actions', () => {
    test('should update team1 name and clear editing state', () => {
      store.dispatch(setEditingTeam('team1'));
      store.dispatch(updateTeamName({ team: 'team1', name: 'New Team 1' }));

      const state = store.getState().game;
      expect(state.team1.name).toBe('New Team 1');
      expect(state.editingTeam).toBe(null);
    });

    test('should update team2 name and clear editing state', () => {
      store.dispatch(setEditingTeam('team2'));
      store.dispatch(updateTeamName({ team: 'team2', name: 'New Team 2' }));

      const state = store.getState().game;
      expect(state.team2.name).toBe('New Team 2');
      expect(state.editingTeam).toBe(null);
    });

    test('should trim whitespace from team names', () => {
      store.dispatch(updateTeamName({ team: 'team1', name: '  Trimmed Team  ' }));

      const state = store.getState().game;
      expect(state.team1.name).toBe('Trimmed Team');
    });

    test('should reject empty team names', () => {
      const originalName = store.getState().game.team1.name;
      store.dispatch(updateTeamName({ team: 'team1', name: '   ' }));

      const state = store.getState().game;
      expect(state.team1.name).toBe(originalName);
    });

    test('should reject team names longer than 20 characters', () => {
      const originalName = store.getState().game.team1.name;
      const longName = 'This is a very long team name that exceeds the limit';
      store.dispatch(updateTeamName({ team: 'team1', name: longName }));

      const state = store.getState().game;
      expect(state.team1.name).toBe(originalName);
    });

    test('should preserve team scores when updating names', () => {
      // Set some scores first
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam2Score());
      store.dispatch(incrementTeam2Score());

      // Update team names
      store.dispatch(updateTeamName({ team: 'team1', name: 'Scorers' }));
      store.dispatch(updateTeamName({ team: 'team2', name: 'Champions' }));

      const state = store.getState().game;
      expect(state.team1.score).toBe(1);
      expect(state.team2.score).toBe(2);
      expect(state.team1.name).toBe('Scorers');
      expect(state.team2.name).toBe('Champions');
    });

    test('should maintain game state when updating team names', () => {
      // Set some game state
      store.dispatch(incrementTeam1Score());
      const initialState = store.getState().game;

      // Update team name
      store.dispatch(updateTeamName({ team: 'team1', name: 'Updated Team' }));

      const state = store.getState().game;
      expect(state.scoreIncrement).toBe(initialState.scoreIncrement);
      expect(state.winCondition).toBe(initialState.winCondition);
      expect(state.isGameActive).toBe(initialState.isGameActive);
      expect(state.winner).toBe(initialState.winner);
    });
  });

  describe('Game Wins Tally State', () => {
    test('should initialize with zero wins for both teams', () => {
      const state = store.getState().game;
      expect(state.gameWins).toBeDefined();
      expect(state.gameWins.team1).toBe(0);
      expect(state.gameWins.team2).toBe(0);
    });

    test('should increment team1 wins', () => {
      store.dispatch(incrementTeam1Wins());
      const state = store.getState().game;
      expect(state.gameWins.team1).toBe(1);
    });

    test('should increment team2 wins', () => {
      store.dispatch(incrementTeam2Wins());
      const state = store.getState().game;
      expect(state.gameWins.team2).toBe(1);
    });

    test('should decrement team1 wins when positive', () => {
      store.dispatch(incrementTeam1Wins());
      store.dispatch(incrementTeam1Wins());
      store.dispatch(decrementTeam1Wins());

      const state = store.getState().game;
      expect(state.gameWins.team1).toBe(1);
    });

    test('should decrement team2 wins when positive', () => {
      store.dispatch(incrementTeam2Wins());
      store.dispatch(incrementTeam2Wins());
      store.dispatch(decrementTeam2Wins());

      const state = store.getState().game;
      expect(state.gameWins.team2).toBe(1);
    });

    test('should not allow negative win counts for team1', () => {
      store.dispatch(decrementTeam1Wins());
      const state = store.getState().game;
      expect(state.gameWins.team1).toBe(0);
    });

    test('should not allow negative win counts for team2', () => {
      store.dispatch(decrementTeam2Wins());
      const state = store.getState().game;
      expect(state.gameWins.team2).toBe(0);
    });

    test('should reset game wins independently', () => {
      store.dispatch(incrementTeam1Wins());
      store.dispatch(incrementTeam2Wins());
      store.dispatch(incrementTeam2Wins());
      store.dispatch(resetGameWins());

      const state = store.getState().game;
      expect(state.gameWins.team1).toBe(0);
      expect(state.gameWins.team2).toBe(0);
    });

    test('should preserve wins when scores are reset', () => {
      // Set some scores and wins
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam2Score());
      store.dispatch(incrementTeam1Wins());
      store.dispatch(incrementTeam2Wins());

      // Reset scores only
      store.dispatch(resetScores());

      const state = store.getState().game;
      expect(state.team1.score).toBe(0);
      expect(state.team2.score).toBe(0);
      expect(state.gameWins.team1).toBe(1);
      expect(state.gameWins.team2).toBe(1);
    });

    test('should maintain wins independence from scoring', () => {
      // Increment scores multiple times
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam1Score());
      store.dispatch(incrementTeam2Score());

      // Increment wins
      store.dispatch(incrementTeam1Wins());

      const state = store.getState().game;
      expect(state.team1.score).toBe(2);
      expect(state.team2.score).toBe(1);
      expect(state.gameWins.team1).toBe(1);
      expect(state.gameWins.team2).toBe(0);
    });
  });
});