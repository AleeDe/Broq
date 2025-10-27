import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { API_ROUTES } from '../../utils/apiRoutes';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const AdminActivities = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '', description: '', price: '', imageUrls: [] });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.ACTIVITIES);
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setForm({ id: null, name: '', description: '', price: '', imageUrls: [] });

  const handleEdit = (f) => {
    setForm({
      id: f.id,
      name: f.name || '',
      description: f.description || '',
      price: f.price || '',
      imageUrls: f.imageUrls || f.images || [],
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await api.delete(`${API_ROUTES.ADMIN_ACTIVITIES_DELETE}/${id}`);
      toast.success('Deleted');
      setItems(items.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = form.imageUrls || [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((f) => uploadToCloudinary(f));
        const urls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...urls];
      }

      const payload = { name: form.name, description: form.description, price: Number(form.price), imageUrls };
      if (form.id) {
        await api.put(`${API_ROUTES.ADMIN_ACTIVITIES_EDIT}/${form.id}`, payload);
        toast.success('Updated');
        fetchActivities();
      } else {
        await api.post(API_ROUTES.ADMIN_ACTIVITIES_CREATE, payload);
        toast.success('Created');
        fetchActivities();
      }
      resetForm();
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save activity');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-4">Manage Activities</h1>

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
              <label className="text-sm text-gray-300">Images (you can select multiple)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="w-full text-white" />
              <div className="mt-3 flex flex-wrap gap-2">
                {form.imageUrls && form.imageUrls.map((src, idx) => (
                  <div key={idx} className="w-24 h-16 bg-gray-800 rounded overflow-hidden relative">
                    <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, imageUrls: form.imageUrls.filter((_, i) => i !== idx) })} className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1">x</button>
                  </div>
                ))}
                {files && files.map((f, i) => (
                  <div key={`local-${i}`} className="w-24 h-16 bg-gray-800 rounded overflow-hidden flex items-center justify-center text-xs text-gray-300">
                    {f.name}
                  </div>
                ))}
              </div>
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
            items.map((f) => (
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

export default AdminActivities;
