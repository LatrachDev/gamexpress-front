import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import api from '../../api/axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', price: '', stock: '', category_id: '', image: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('products');
      setProducts(response.data.products || []);
    } catch (error) {
      showSnackbar('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image: []
      });
      setSelectedProduct(product);
      setIsEditing(true);
    } else {
      setFormData({ name: '', slug: '', price: '', stock: '', category_id: '', image: [] });
      setSelectedProduct(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDeleteDialog = (product) => { setSelectedProduct(product); setOpenDeleteDialog(true); };
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        Array.from(formData.image).forEach(file => data.append('image[]', file));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditing) {
        await api.post(`products/${selectedProduct.id}?_method=PUT`, data);
        showSnackbar('Product updated successfully');
      } else {
        await api.post('products', data);
        showSnackbar('Product created successfully');
      }
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar(`Failed to ${isEditing ? 'update' : 'create'} product`, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`products/${selectedProduct.id}`);
      showSnackbar('Product deleted successfully');
      handleCloseDeleteDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛒 Products</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition duration-200"
        >
          <Add className="text-white" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left uppercase text-xs">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.slug}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenDialog(product)} className="text-blue-600 hover:text-blue-800">
                      <Edit />
                    </button>
                    <button onClick={() => handleDelete(product)} className="text-red-600 hover:text-red-800">
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <div className='p-5'>
          <span className="text-lg font-semibold">{isEditing ? 'Edit Product' : 'Add New Product'}</span>
          <button onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </button>
        </div>
        <DialogContent className="space-y-6">
          <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleInputChange} />
          <TextField label="Slug" name="slug" fullWidth value={formData.slug} onChange={handleInputChange} helperText="Auto-generated from name." />
          <TextField label="Price" name="price" fullWidth value={formData.price} onChange={handleInputChange} />
          <TextField label="Stock" name="stock" fullWidth value={formData.stock} onChange={handleInputChange} />
          <TextField select label="Category" name="category_id" fullWidth value={formData.category_id} onChange={handleInputChange}>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <input type="file" name="image" multiple onChange={handleFileChange} />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{isEditing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Products;