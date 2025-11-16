import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    loadUserData();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const loadUserData = () => {
    if (user) {
      setUserInfo({
        full_name: user.full_name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Buyurtmalar yuklanmadi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/wishlist/');
      setWishlist(response.data);
    } catch (error) {
      console.error('Sevimlilar yuklanmadi:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/profile/', userInfo);
      setEditMode(false);
      alert('Ma\'lumotlar yangilandi');
    } catch (error) {
      console.error('Yangilashda xatolik:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleLogout = () => {
    if (confirm('Profildan chiqmoqchimisiz?')) {
      logout();
      navigate('/');
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('Buyurtmani bekor qilmoqchimisiz?')) return;

    try {
      await api.post(`/products/orders/${id}/cancel/`);
      fetchOrders();
    } catch (error) {
      console.error('Bekor qilishda xatolik:', error);
      alert(error.response?.data?.error || 'Xatolik yuz berdi');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-50 text-blue-800 border-blue-200',
      shipped: 'bg-purple-50 text-purple-800 border-purple-200',
      delivered: 'bg-green-50 text-green-800 border-green-200',
      cancelled: 'bg-red-50 text-red-800 border-red-200',
    };
    return badges[status] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const tabs = [
    { id: 'account', label: 'Mening Hisobim', icon: '👤' },
    { id: 'orders', label: 'Buyurtmalar', icon: '📦' },
    { id: 'wishlist', label: 'Sevimlilar', icon: '❤️' },
    { id: 'settings', label: 'Sozlamalar', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide mb-2">
            Profil
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-light">
            Shaxsiy ma'lumotlaringizni boshqaring
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 font-light transition-all flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-sm tracking-wide">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Top Navigation - Mobile */}
          <div className="lg:hidden overflow-x-auto">
            <nav className="flex border-b border-gray-200 bg-white">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-xs font-light transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="block text-lg mb-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white border border-gray-200">
              {/* My Account Tab */}
              {activeTab === 'account' && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                      Shaxsiy Ma'lumotlar
                    </h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-light tracking-wide hover:bg-gray-800 transition-colors"
                      >
                        TAHRIRLASH
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div>
                        <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                          To'liq Ism
                        </label>
                        <input
                          type="text"
                          value={userInfo.full_name}
                          onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-gray-900 text-white font-light tracking-wide hover:bg-gray-800 transition-colors"
                        >
                          SAQLASH
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            loadUserData();
                          }}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-light tracking-wide hover:bg-gray-200 transition-colors"
                        >
                          BEKOR QILISH
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                        <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-light">
                          {userInfo.full_name.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="text-xl font-light text-gray-900 mb-1">
                            {userInfo.full_name || user?.username || 'Foydalanuvchi'}
                          </h3>
                          <p className="text-sm text-gray-600 font-light">
                            {userInfo.email || 'Email kiritilmagan'}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 font-light mb-1 uppercase tracking-wide">
                            To'liq Ism
                          </p>
                          <p className="text-base text-gray-900 font-light">
                            {userInfo.full_name || 'Kiritilmagan'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-light mb-1 uppercase tracking-wide">
                            Email
                          </p>
                          <p className="text-base text-gray-900 font-light">
                            {userInfo.email || 'Kiritilmagan'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-light mb-1 uppercase tracking-wide">
                            Telefon
                          </p>
                          <p className="text-base text-gray-900 font-light">
                            {userInfo.phone || 'Kiritilmagan'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-light mb-1 uppercase tracking-wide">
                            Foydalanuvchi nomi
                          </p>
                          <p className="text-base text-gray-900 font-light">
                            {user?.username || 'Kiritilmagan'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
                    Buyurtmalar Tarixi
                  </h2>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                      <p className="mt-4 text-gray-900 font-light">Yuklanmoqda...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 border border-gray-200">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        Buyurtmalar yo'q
                      </h3>
                      <p className="text-gray-600 font-light mb-6">
                        Siz hali buyurtma bermagansiz
                      </p>
                      <Link
                        to="/products"
                        className="inline-block bg-gray-900 text-white px-8 py-3 font-light tracking-wide hover:bg-gray-800 transition-colors"
                      >
                        XARID QILISH
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 p-6 hover:border-gray-900 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                            <div>
                              <h3 className="text-lg font-light text-gray-900">
                                Buyurtma #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600 font-light">
                                {new Date(order.created_at).toLocaleDateString('uz-UZ', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <span
                              className={`inline-block px-4 py-2 text-xs font-light border tracking-wide ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status_display}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mb-4 overflow-x-auto">
                            {order.items.slice(0, 4).map((item) => (
                              <img
                                key={item.id}
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover border border-gray-200"
                              />
                            ))}
                            {order.items.length > 4 && (
                              <span className="text-sm text-gray-600 font-light">
                                +{order.items.length - 4}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                            <p className="text-lg font-light text-gray-900">
                              {order.total_price.toLocaleString()} so'm
                            </p>
                            <div className="flex gap-3">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="px-4 py-2 text-sm border border-gray-300 text-gray-900 font-light tracking-wide hover:border-gray-900 transition-colors"
                                >
                                  BEKOR QILISH
                                </button>
                              )}
                              <Link
                                to={`/orders/${order.id}`}
                                className="px-6 py-2 bg-gray-900 text-white text-sm font-light tracking-wide hover:bg-gray-800 transition-colors"
                              >
                                BATAFSIL
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
                    Sevimli Mahsulotlar
                  </h2>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                      <p className="mt-4 text-gray-900 font-light">Yuklanmoqda...</p>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 border border-gray-200">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        Sevimli mahsulotlar yo'q
                      </h3>
                      <p className="text-gray-600 font-light mb-6">
                        Mahsulotlarni sevimlilar ro'yxatiga qo'shing
                      </p>
                      <Link
                        to="/products"
                        className="inline-block bg-gray-900 text-white px-8 py-3 font-light tracking-wide hover:bg-gray-800 transition-colors"
                      >
                        MAHSULOTLARNI KO'RISH
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="group">
                          <Link to={`/products/${item.product.slug}`}>
                            <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden border border-gray-200">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <h3 className="text-sm font-light text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm font-light text-gray-900">
                              {item.product.price.toLocaleString()} so'm
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
                    Sozlamalar
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 p-6">
                      <h3 className="text-lg font-light text-gray-900 mb-2">
                        Parol
                      </h3>
                      <p className="text-sm text-gray-600 font-light mb-4">
                        Hisobingiz xavfsizligini ta'minlash uchun parolni yangilang
                      </p>
                      <button className="px-6 py-2 border border-gray-900 text-gray-900 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
                        PAROLNI O'ZGARTIRISH
                      </button>
                    </div>

                    <div className="border border-gray-200 p-6">
                      <h3 className="text-lg font-light text-gray-900 mb-2">
                        Bildirishnomalar
                      </h3>
                      <p className="text-sm text-gray-600 font-light mb-4">
                        Email va SMS bildirishnomalarni boshqaring
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                          />
                          <span className="text-sm font-light text-gray-900">
                            Buyurtma yangilanishlari
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                          />
                          <span className="text-sm font-light text-gray-900">
                            Yangi mahsulotlar va chegirmalar
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-red-200 p-6 bg-red-50">
                      <h3 className="text-lg font-light text-gray-900 mb-2">
                        Hisobdan chiqish
                      </h3>
                      <p className="text-sm text-gray-600 font-light mb-4">
                        Profilingizdan chiqish uchun tugmani bosing
                      </p>
                      <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 text-white text-sm font-light tracking-wide hover:bg-red-700 transition-colors"
                      >
                        CHIQISH
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
