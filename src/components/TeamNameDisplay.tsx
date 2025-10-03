import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';

const MAX_TEAM_NAME_LENGTH = 20;

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancelEdit();
    } else if (event.key === 'Enter') {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <TextField
          data-testid={`${teamId}-name-input`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          sx={{
            '& .MuiInputBase-input': {
              fontSize: 32,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              minWidth: 150,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 0.5,
              padding: 0.5,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        mb: 5,
      }}
    >
      <Typography
        data-testid={`${teamId}-name`}
        sx={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        {name}
      </Typography>
      <IconButton
        data-testid={`${teamId}-edit-icon`}
        onClick={() => onStartEdit(teamId)}
        aria-label="Edit team name"
        sx={{
          ml: 1,
          p: 0.5,
          minWidth: 24,
          minHeight: 24,
        }}
      >
        <span style={{ fontSize: 16 }}>✏️</span>
      </IconButton>
    </Box>
  );
};

export default TeamNameDisplay;