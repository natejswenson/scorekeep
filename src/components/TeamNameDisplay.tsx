import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MAX_TEAM_NAME_LENGTH = 20;
const MIN_TOUCH_TARGET_SIZE = 24;

interface TeamNameDisplayProps {
  teamId: 'team1' | 'team2';
  name: string;
  isEditing: boolean;
  onStartEdit: (teamId: 'team1' | 'team2') => void;
  onSaveName: (teamId: 'team1' | 'team2', name: string) => void;
  onCancelEdit: () => void;
}

const TeamNameDisplay: React.FC<TeamNameDisplayProps> = ({
  teamId,
  name,
  isEditing,
  onStartEdit,
  onSaveName,
  onCancelEdit,
}) => {
  const [inputValue, setInputValue] = useState(name);

  // Update input value when name prop changes
  useEffect(() => {
    setInputValue(name);
  }, [name]);

  const handleSave = () => {
    const trimmedName = inputValue.trim();
    if (trimmedName.length > 0) {
      const validName = trimmedName.length > MAX_TEAM_NAME_LENGTH
        ? trimmedName.substring(0, MAX_TEAM_NAME_LENGTH)
        : trimmedName;
      onSaveName(teamId, validName);
    }
  };

  const handleKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (event.nativeEvent.key === 'Escape') {
      onCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <View style={styles.nameContainer}>
        <TextInput
          testID={`${teamId}-name-input`}
          style={[styles.nameInput, { color: '#FFFFFF' }]}
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          onKeyPress={handleKeyPress}
          autoFocus
          selectTextOnFocus
        />
      </View>
    );
  }

  return (
    <View style={styles.nameContainer}>
      <Text testID={`${teamId}-name`} style={styles.teamNameText}>
        {name}
      </Text>
      <TouchableOpacity
        testID={`${teamId}-edit-icon`}
        style={styles.editIcon}
        onPress={() => onStartEdit(teamId)}
        accessibilityLabel="Edit team name"
        accessibilityRole="button"
      >
        <Text style={styles.editIconText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  teamNameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  editIcon: {
    marginLeft: 8,
    padding: 4,
    minWidth: MIN_TOUCH_TARGET_SIZE,
    minHeight: MIN_TOUCH_TARGET_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 16,
  },
  nameInput: {
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 4,
    textAlign: 'center',
    minWidth: 150,
  },
});

export default TeamNameDisplay;