import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Alert } from '@mui/material';
import api from '../context/api';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [openUser, setOpenUser] = useState(false);
  const [openStore, setOpenStore] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStats = async () => {
    const res = await api.get('/dashboard');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/users', { params: { ...filters, sortBy, order } });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await api.get('/stores', { params: { sortBy, order } });
    setStores(res.data);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (field) => {
    const newOrder = sortBy === field && order === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(field);
    setOrder(newOrder);
  };

  const handleCreateUser = async () => {
    try {
      await api.post('/users', newUser);
      setSuccess('User created!');
      setOpenUser(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleCreateStore = async () => {
    try {
      await api.post('/stores', newStore);
      setSuccess('Store created!');
      setOpenStore(false);
      fetchStores();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f4f5fa">
      <Navbar title="Admin Dashboard" />
      <Box p={4}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Stats */}
        <Grid container spacing={3} mb={4}>
          {[{ label: 'Total Users', value: stats.totalUsers }, { label: 'Total Stores', value: stats.totalStores }, { label: 'Total Ratings', value: stats.totalRatings }].map((s) => (
            <Grid item xs={4} key={s.label}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{s.value}</Typography>
                <Typography>{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Users Table */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Users</Typography>
          <Button variant="contained" onClick={() => setOpenUser(true)}>Add User</Button>
        </Box>
        <Box display="flex" gap={2} mb={2}>
          {['name', 'email', 'address'].map(f => (
            <TextField key={f} label={f} size="small" value={filters[f]} onChange={e => setFilters({ ...filters, [f]: e.target.value })} />
          ))}
          <Select size="small" value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
          </Select>
          <Button variant="contained" onClick={fetchUsers}>Filter</Button>
        </Box>
        <Paper sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['name', 'email', 'address', 'role'].map(col => (
                  <TableCell key={col}>
                    <TableSortLabel active={sortBy === col} direction={order.toLowerCase()} onClick={() => handleSort(col)}>
                      {col.toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.address}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Stores Table */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Stores</Typography>
          <Button variant="contained" onClick={() => setOpenStore(true)}>Add Store</Button>
        </Box>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {['Name', 'Email', 'Address', 'Rating'].map(col => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.address}</TableCell>
                  <TableCell>{s.averageRating?.toFixed(1) || 'No ratings'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Add User Dialog */}
        <Dialog open={openUser} onClose={() => setOpenUser(false)}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {['name', 'email', 'address', 'password'].map(f => (
              <TextField key={f} label={f} type={f === 'password' ? 'password' : 'text'} value={newUser[f]} onChange={e => setNewUser({ ...newUser, [f]: e.target.value })} />
            ))}
            <Select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <MenuItem value="user">Normal User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="store_owner">Store Owner</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUser(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateUser}>Create</Button>
          </DialogActions>
        </Dialog>

        {/* Add Store Dialog */}
        <Dialog open={openStore} onClose={() => setOpenStore(false)}>
          <DialogTitle>Add New Store</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {['name', 'email', 'address'].map(f => (
              <TextField key={f} label={f} value={newStore[f]} onChange={e => setNewStore({ ...newStore, [f]: e.target.value })} />
            ))}
            <TextField label="Owner ID (optional)" value={newStore.ownerId} onChange={e => setNewStore({ ...newStore, ownerId: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStore(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateStore}>Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}