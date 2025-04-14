import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, People, BarChart } from '@mui/icons-material';
import api from '../api/axios';
import Products from '../pages/products/Products';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    product_count: 0,
    available_products: 0,
    total_users: 0,
  });
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    console.log("User data in Dashboard:", {
      user,
      hasRequiredRoles: user?.user?.roles?.some(role =>
        ['product_manager', 'super_admin'].includes(role.name)
      )
    });
  }, [user]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('dashboard');
        console.log(data);
        
        console.log('API Response:', data); // Log the API response
        setStatistics({
          product_count: data.product_count || 0,
          available_products: data.available_products || 0,
          total_users: data.total_users || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  console.log("Total Products:", statistics.product_count);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, <span className='font-bold'>{user.user?.name}</span>, your are a <span className='font-bold'>{user.roles[0]}</span> 
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <ShoppingCart color="primary" />
              </Box>
              <Typography variant="h5">{statistics.product_count}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Available Products
                </Typography>
                <DashboardIcon color="primary" />
              </Box>
              <Typography variant="h5">{statistics.available_products}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <People color="primary" />
              </Box>
              <Typography variant="h5">{statistics.total_users}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;