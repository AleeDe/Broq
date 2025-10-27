import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { API_ROUTES } from '../../utils/apiRoutes';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '', description: '', price: '', images: [], available: true, category: 'BREAKFAST' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.FOOD);
      setFoods(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load foods');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setForm({ id: null, name: '', description: '', price: '', images: [], available: true, category: 'BREAKFAST' });

  const handleEdit = (f) => {
    setForm({ id: f.id, name: f.name || '', description: f.description || '', price: f.price || '', images: f.images || [], available: typeof f.available === 'boolean' ? f.available : true, category: f.category || 'BREAKFAST' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await api.delete(`${API_ROUTES.ADMIN_FOODSDELETE}/${id}`);
      toast.success('Deleted');
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let images = form.images || [];
      if (file) {
        const url = await uploadToCloudinary(file);
        images = [...images, url];
      }

  const payload = { name: form.name, description: form.description, price: Number(form.price), available: !!form.available, images, category: form.category };
      if (form.id) {
        await api.put(`${API_ROUTES.ADMIN_FOODSEDITE}/${form.id}`, payload);
        toast.success('Updated');
        fetchFoods();
      } else {
        await api.post(API_ROUTES.ADMIN_FOODSCREATE, payload);
        toast.success('Created');
        fetchFoods();
      }
      resetForm();
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save food');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-4">Manage Foods</h1>

        <div className="bg-black/40 p-6 rounded-lg border border-white/10 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Price</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-white" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#C1A57B] px-4 py-2 rounded text-black">Save</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded border border-white/10">Reset</button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            foods.map((f) => (
              <div key={f.id} className="bg-black/40 p-4 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{f.name}</h3>
                  <p className="text-gray-400 text-sm">{f.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(f)} className="px-3 py-1 bg-yellow-600 rounded">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFoods;
