import React from 'react';
import { render, fireEvent } from '../src/test-utils/test-utils';
import TeamNameDisplay from '../src/components/TeamNameDisplay';

// Test store factory

describe('TeamNameDisplay Component', () => {
  describe('Display Mode', () => {
    test('should display team name when not in edit mode', () => {
      const { getByTestId, store } = render(<TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={false}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      expect(getByTestId('team1-name')).toHaveTextContent('Team 1');
      expect(getByTestId('team1-edit-icon')).toBeTruthy();
    });

    test('should display edit icon next to team name', () => {
      const { getByTestId, store } = render(<TeamNameDisplay
            teamId="team2"
            name="Team 2"
            isEditing={false}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      expect(getByTestId('team2-edit-icon')).toBeTruthy();
    });

    test('should call onStartEdit when edit icon is pressed', () => {
      const store = createTestStore();
      const mockStartEdit = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={false}
            onStartEdit={mockStartEdit}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      fireEvent.click(getByTestId('team1-edit-icon'));
      expect(mockStartEdit).toHaveBeenCalledWith('team1');
    });
  });

  describe('Edit Mode', () => {
    test('should show text input when in edit mode', () => {
      const { getByTestId, queryByTestId, store } = render(<TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      expect(getByTestId('team1-name-input')).toBeTruthy();
      expect(queryByTestId('team1-edit-icon')).toBeNull();
    });

    test('should display current team name in input field', () => {
      const { getByTestId, store } = render(<TeamNameDisplay
            teamId="team2"
            name="Volleyball Stars"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      const input = getByTestId('team2-name-input');
      expect(input.props.value).toBe('Volleyball Stars');
    });

    test('should call onSaveName when input loses focus', () => {
      const store = createTestStore();
      const mockSaveName = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={mockSaveName}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, 'New Team Name');
      fireEvent(input, 'blur');

      expect(mockSaveName).toHaveBeenCalledWith('team1', 'New Team Name');
    });

    test('should call onCancelEdit when Escape key is pressed', () => {
      const store = createTestStore();
      const mockCancelEdit = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={mockCancelEdit}
          />
        </Provider>
      );

      const input = getByTestId('team1-name-input');
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Escape' } });

      expect(mockCancelEdit).toHaveBeenCalled();
    });

    test('should call onSaveName when Enter key is pressed', () => {
      const store = createTestStore();
      const mockSaveName = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team2"
            name="Team 2"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={mockSaveName}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      const input = getByTestId('team2-name-input');
      fireEvent.changeText(input, 'Updated Team');
      fireEvent(input, 'submitEditing');

      expect(mockSaveName).toHaveBeenCalledWith('team2', 'Updated Team');
    });
  });

  describe('Accessibility', () => {
    test('should have proper accessibility labels', () => {
      const { getByTestId, store } = render(<TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={false}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      expect(getByTestId('team1-edit-icon')).toHaveProp('accessibilityLabel', 'Edit team name');
      expect(getByTestId('team1-edit-icon')).toHaveProp('accessibilityRole', 'button');
    });

    test('should have proper touch target size for edit icon', () => {
      const { getByTestId, store } = render(<TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={false}
            onStartEdit={jest.fn()}
            onSaveName={jest.fn()}
            onCancelEdit={jest.fn()}
          />);

      const editIcon = getByTestId('team1-edit-icon');
      const style = editIcon.props.style;
      expect(style.minWidth).toBeGreaterThanOrEqual(24);
      expect(style.minHeight).toBeGreaterThanOrEqual(24);
    });
  });

  describe('Input Validation', () => {
    test('should not save empty team names', () => {
      const store = createTestStore();
      const mockSaveName = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={mockSaveName}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, '   '); // Only whitespace
      fireEvent(input, 'blur');

      expect(mockSaveName).not.toHaveBeenCalled();
    });

    test('should trim whitespace from team names', () => {
      const store = createTestStore();
      const mockSaveName = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={mockSaveName}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      const input = getByTestId('team1-name-input');
      fireEvent.changeText(input, '  New Team  ');
      fireEvent(input, 'blur');

      expect(mockSaveName).toHaveBeenCalledWith('team1', 'New Team');
    });

    test('should limit team name length to 20 characters', () => {
      const store = createTestStore();
      const mockSaveName = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <TeamNameDisplay
            teamId="team1"
            name="Team 1"
            isEditing={true}
            onStartEdit={jest.fn()}
            onSaveName={mockSaveName}
            onCancelEdit={jest.fn()}
          />
        </Provider>
      );

      const input = getByTestId('team1-name-input');
      const longName = 'This is a very long team name that exceeds limit';
      fireEvent.changeText(input, longName);
      fireEvent(input, 'blur');

      expect(mockSaveName).toHaveBeenCalledWith('team1', longName.substring(0, 20));
    });
  });
});