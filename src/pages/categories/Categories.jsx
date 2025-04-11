import { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import api from '../../api/axios';


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('categories');
      console.log(response);
      console.log(response.data);

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showSnackbar('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({ name: category.name, slug: category.slug });
      setSelectedCategory(category);
      setIsEditing(true);
    } else {
      setFormData({ name: '', slug: '' });
      setSelectedCategory(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if slug field isn't manually edited
    if (name === 'name') {
      setFormData(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await api.put(`categories/${selectedCategory.id}`, formData);
        showSnackbar('Category updated successfully');
      } else {
        await api.post('categories', formData);
        showSnackbar('Category created successfully');
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showSnackbar(
        `Failed to ${isEditing ? 'update' : 'create'} category: ${error.response?.data?.message || error.message}`, 
        'error'
      );
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`categories/${selectedCategory.id}`);
      console.log(selectedCategory.id);
      showSnackbar('Category deleted successfully');
      handleCloseDeleteDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar(
        `Failed to delete category: ${error.response?.data?.message || error.message}`, 
        'error'
      );
      handleCloseDeleteDialog();
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
        <h1 className="text-3xl font-bold text-gray-800">📂 Categories</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition duration-200"
        >
          <Add className="text-white" />
          <span>Add Category</span>
        </button>
      </div>
  
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left uppercase text-xs">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className=" hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{category.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <IconButton
                      onClick={() => handleOpenDialog(category)}
                      aria-label="edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(category)}
                      aria-label="delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Add/Edit Category Dialog (MUI with slight visual tweaks) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <span className="text-lg font-semibold">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </span>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="slug"
            label="Slug"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.slug}
            onChange={handleInputChange}
            helperText="Used in URLs. Only lowercase letters, numbers, and hyphens."
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.slug}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedCategory?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
  
  
};

export default Categories;