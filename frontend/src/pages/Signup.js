import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import api from '../context/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    try {
      await api.post('/auth/signup', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField fullWidth label="Full Name (min 20 chars)" name="name" value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" name="password" value={form.password} onChange={handleChange} sx={{ mb: 3 }} helperText="8-16 chars, 1 uppercase, 1 special character" />
        <Button fullWidth variant="contained" onClick={handleSignup}>Sign Up</Button>
        <Typography mt={2} textAlign="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}