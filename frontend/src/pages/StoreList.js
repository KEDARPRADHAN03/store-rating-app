import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Rating, Alert } from '@mui/material';
import api from '../context/api';
import Navbar from '../components/Navbar';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [success, setSuccess] = useState('');

  const fetchStores = async () => {
    const res = await api.get('/stores', { params: search });
    const storesData = res.data;
    const storesWithMyRating = await Promise.all(storesData.map(async (store) => {
      try {
        const r = await api.get(`/ratings/store/${store.id}/my`);
        return { ...store, myRating: r.data?.rating || 0 };
      } catch { return { ...store, myRating: 0 }; }
    }));
    setStores(storesWithMyRating);
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRate = async (storeId, rating) => {
    await api.post('/ratings', { storeId, rating });
    setSuccess('Rating submitted!');
    fetchStores();
  };

  return (
    <Box minHeight="100vh" bgcolor="#f4f5fa">
      <Navbar title="Browse Stores" />
      <Box p={4}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box display="flex" gap={2} mb={3}>
          <TextField label="Search by Name" size="small" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
          <TextField label="Search by Address" size="small" value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
          <Button variant="contained" onClick={fetchStores}>Search</Button>
        </Box>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Store Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Overall Rating</TableCell>
                <TableCell>Your Rating</TableCell>
                <TableCell>Submit Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map(store => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>
                    <Rating value={store.averageRating} precision={0.1} readOnly />
                    <Typography variant="caption">({store.averageRating?.toFixed(1) || 0})</Typography>
                  </TableCell>
                  <TableCell>
                    <Rating value={store.myRating} readOnly />
                  </TableCell>
                  <TableCell>
                    <Rating value={store.myRating} onChange={(e, val) => handleRate(store.id, val)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}