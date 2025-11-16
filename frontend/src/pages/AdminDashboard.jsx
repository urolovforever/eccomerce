import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth, logout, getAdminProducts, getCategories, updateProduct, deleteProduct } from '../api/api';
import ProductEditModal from '../components/ProductEditModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        navigate('/admin/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          getAdminProducts(),
          getCategories()
        ]);

        setProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
  };

  const handleSaveEdit = async (id, formData) => {
    try {
      await updateProduct(id, formData);

      // Refresh products list
      const response = await getAdminProducts();
      setProducts(response.data.results || response.data);

      setEditingProduct(null);
      alert('Mahsulot muvaffaqiyatli tahrirlandi!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Tahrirlashda xatolik yuz berdi: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id);

      // Refresh products list
      const response = await getAdminProducts();
      setProducts(response.data.results || response.data);

      setDeletingProduct(null);
      alert('Mahsulot muvaffaqiyatli o\'chirildi!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('O\'chirishda xatolik yuz berdi: ' + (err.response?.data?.error || err.message));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Noma\'lum';
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-wood-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-wood-900">🌙 MoonGift Admin Panel</h1>
              <p className="text-sm text-wood-600 mt-1">
                Xush kelibsiz, {user.username}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-wood-900">Mahsulotlar ro'yxati</h2>
          </div>

          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-wood-600">Yuklanmoqda...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rasm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoriya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Narx
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chegirma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getCategoryName(product.category)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.price.toLocaleString()} so'm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.discount_percentage > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.discount_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_active ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
