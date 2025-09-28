import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
  updateTeam1,
  updateTeam2,
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
});