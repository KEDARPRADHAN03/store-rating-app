import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleColors = {
    admin: '#e53935',
    user: '#1e88e5',
    store_owner: '#43a047',
  };

  const roleLabels = {
    admin: 'Administrator',
    user: 'Normal User',
    store_owner: 'Store Owner',
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: '#6c63ff', width: 36, height: 36 }}>
            <StoreIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" fontWeight="700" letterSpacing={0.5}>
            {title}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Chip
              label={roleLabels[user.role] || user.role}
              size="small"
              sx={{ bgcolor: roleColors[user.role], color: 'white', fontWeight: 600 }}
            />
          )}
          {user && user.role !== 'admin' && (
            <Button
              variant="text"
              size="small"
              sx={{ color: '#cfd2ff' }}
              onClick={() => navigate('/change-password')}
            >
              Change Password
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={() => { logout(); navigate('/login'); }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}