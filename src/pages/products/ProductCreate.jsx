import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  OutlinedInput,
  Grid,
} from '@mui/material';
import api from '../../api/axios';

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    stock: '',
    category_id: '',
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-');
    setForm(prev => ({ ...prev, slug }));
  }, [form.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({ ...prev, images: files }));

    // Image preview
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('slug', form.slug);
    data.append('price', form.price);
    data.append('stock', form.stock);
    data.append('category_id', form.category_id);
    form.images.forEach((img, i) => {
      data.append(`images[${i}]`, img);
    });

    try {
      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Product
      </Typography>

      <TextField
        fullWidth
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Slug"
        name="slug"
        value={form.slug}
        disabled
        margin="normal"
      />

      <TextField
        fullWidth
        label="Price"
        name="price"
        value={form.price}
        onChange={handleChange}
        type="number"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Stock"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        type="number"
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          input={<OutlinedInput label="Category" />}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" component="label" sx={{ mt: 2 }}>
        Upload Images
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageChange}
        />
      </Button>

      {previews.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {previews.map((src, idx) => (
            <Grid item xs={4} key={idx}>
              <img src={src} alt={`preview-${idx}`} style={{ width: '100%', borderRadius: 8 }} />
            </Grid>
          ))}
        </Grid>
      )}

      <Button variant="contained" type="submit" sx={{ mt: 4 }}>
        Create Product
      </Button>
    </Box>
  );
};

export default CreateProduct;
