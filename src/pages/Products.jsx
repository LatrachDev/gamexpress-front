import { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { ShoppingCart, Category, AttachMoney, Image } from '@mui/icons-material';
import api from '../api/axios';

const Products = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('v1/admin/products');
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Products
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography color="textSecondary">Price:</Typography>
                                    <Box display="flex" alignItems="center">
                                        <AttachMoney color="primary" />
                                        <Typography variant="body1">{product.price}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography color="textSecondary">Stock:</Typography>
                                    <Typography variant="body1">{product.stock}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography color="textSecondary">Category:</Typography>
                                    <Category color="primary" />
                                    <Typography variant="body1">{product.category_id}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography color="textSecondary">Images:</Typography>
                                    <Image color="primary" />
                                    <Typography variant="body1">{product.images.length} images</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Products