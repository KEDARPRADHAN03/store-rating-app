import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import api from '../context/api';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.post('/auth/change-password', form);
      setSuccess('Password changed! Redirecting...');
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">Change Password</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField fullWidth label="Old Password" type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} sx={{ mb: 3 }} helperText="8-16 chars, 1 uppercase, 1 special character" />
        <Button fullWidth variant="contained" onClick={handleSubmit}>Change Password</Button>
        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate(-1)}>Go Back</Button>
      </Paper>
    </Box>
  );
}