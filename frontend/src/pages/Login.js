import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'store_owner') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 3 }} />
        <Button fullWidth variant="contained" onClick={handleLogin}>Login</Button>
        <Typography mt={2} textAlign="center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Paper>
    </Box>
  );
}