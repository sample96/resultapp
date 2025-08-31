import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const initialForm = { name: '', description: '' };

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditId(cat._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setFormLoading(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category added');
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      toast.error('Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mawlid Categories</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-150"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No Mawlid categories found.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 font-semibold">{cat.name}</td>
                  <td className="px-4 py-2">{cat.description || <span className="text-gray-300">-</span>}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-scaleIn">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              <X />
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900">{editId ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[60px]"
                  disabled={formLoading}
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-150 disabled:opacity-60"
              >
                {formLoading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Category' : 'Add Category')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager; 