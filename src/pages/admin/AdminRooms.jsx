import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { API_ROUTES } from '../../utils/apiRoutes';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '', type: 'SINGLE', description: '', price: '', capacity: '', images: [] });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.ROOMS);
      setRooms(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setForm({ id: null, name: '', type: 'SINGLE', description: '', price: '', capacity: '', images: [] });

  const handleEdit = (r) => {
    setForm({ id: r.id, name: r.name || '', type: r.type || 'SINGLE', description: r.description || '', price: r.price || '', capacity: r.capacity || '', images: r.images || [] });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try {
      await api.delete(`${API_ROUTES.ADMIN_ROOMS_DELETE}/${id}`);
      toast.success('Deleted');
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let images = form.images || [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((f) => uploadToCloudinary(f));
        const urls = await Promise.all(uploadPromises);
        images = [...images, ...urls];
      }

      const payload = {
        name: form.name,
        type: form.type,
        description: form.description,
        price: Number(form.price),
        capacity: Number(form.capacity),
        images,
      };
      if (form.id) {
        await api.put(`${API_ROUTES.ADMIN_ROOMS_EDIT}/${form.id}`, payload);
        toast.success('Updated');
        fetchRooms();
      } else {
        await api.post(API_ROUTES.ADMIN_ROOMS_CREATE, payload);
        toast.success('Created');
        fetchRooms();
      }
      resetForm();
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save room');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-4">Manage Rooms</h1>

        <div className="bg-black/40 p-6 rounded-lg border border-white/10 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full p-2 rounded bg-black/50 border border-white/10 text-white">
                <option value="SINGLE">SINGLE</option>
                <option value="DOUBLE">DOUBLE</option>
                <option value="TWIN">TWIN</option>
                <option value="SUITE">SUITE</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Price</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-300">Capacity</label>
                <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} type="number" className="w-full p-2 rounded bg-black/50 border border-white/10 text-white" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">Images (you can select multiple)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="w-full text-white" />
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images && form.images.map((src, idx) => (
                  <div key={idx} className="w-24 h-16 bg-gray-800 rounded overflow-hidden relative">
                    <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })} className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1">x</button>
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
            rooms.map((r) => (
              <div key={r.id} className="bg-black/40 p-4 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{r.name} <span className="text-sm text-gray-400">({r.type})</span></h3>
                  <p className="text-gray-400 text-sm">{r.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(r)} className="px-3 py-1 bg-yellow-600 rounded">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRooms;
