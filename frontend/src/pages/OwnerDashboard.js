import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Rating } from '@mui/material';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const storesRes = await api.get('/stores');
      const myStore = storesRes.data.find(s => s.owner?.id === user.userId);
      if (myStore) {
        const ratingsRes = await api.get(`/ratings/store/${myStore.id}`);
        setRatings(ratingsRes.data);
        const avg = ratingsRes.data.length
          ? ratingsRes.data.reduce((a, b) => a + b.rating, 0) / ratingsRes.data.length
          : 0;
        setAvgRating(avg);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box minHeight="100vh" bgcolor="#f4f5fa">
      <Navbar title="My Store Dashboard" />
      <Box p={4}>
        <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Average Rating:</Typography>
          <Rating value={avgRating} precision={0.1} readOnly />
          <Typography variant="h6">{avgRating.toFixed(1)}</Typography>
        </Paper>
        <Typography variant="h6" mb={2}>Users Who Rated Your Store</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratings.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.user?.name}</TableCell>
                  <TableCell>{r.user?.email}</TableCell>
                  <TableCell><Rating value={r.rating} readOnly /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}