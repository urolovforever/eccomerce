import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
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

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: ClockIcon,
        label: 'Kutilmoqda'
      },
      processing: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Cog6ToothIcon,
        label: 'Tayyorlanmoqda'
      },
      shipped: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: TruckIcon,
        label: 'Yo\'lda'
      },
      delivered: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircleIcon,
        label: 'Yetkazildi'
      },
      cancelled: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: XCircleIcon,
        label: 'Bekor qilindi'
      },
    };
    return configs[status] || configs.pending;
  };

  const tabs = [
    { id: 'account', label: 'Mening Hisobim', icon: UserCircleIcon },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Sevimlilar', icon: HeartIcon },
    { id: 'settings', label: 'Sozlamalar', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-white to-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Elegant Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-light text-text-primary tracking-tight mb-3 animate-fadeIn">
            Mening Profilim
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light">
            Shaxsiy ma'lumotlaringiz va buyurtmalaringizni boshqaring
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft-md border border-border-light overflow-hidden sticky top-24">
              {/* User Profile Summary */}
              <div className="p-6 bg-gradient-to-br from-primary-50 to-white border-b border-border-light">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-3xl font-light shadow-lg mb-4">
                    {userInfo.full_name.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    {userInfo.full_name || user?.username || 'Foydalanuvchi'}
                  </h3>
                  <p className="text-sm text-text-secondary font-light">
                    {userInfo.email || 'Email kiritilmagan'}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg font-light transition-all duration-300 flex items-center gap-3 mb-1 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-md transform scale-[1.02]'
                          : 'text-text-primary hover:bg-surface-light hover:transform hover:translate-x-1'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm tracking-wide">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Top Navigation - Mobile */}
          <div className="lg:hidden bg-white rounded-xl shadow-soft-md border border-border-light overflow-hidden">
            <div className="grid grid-cols-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-4 text-xs font-light transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 border-b-2 border-primary-600 text-primary-700'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-soft-lg border border-border-light overflow-hidden">
              {/* My Account Tab */}
              {activeTab === 'account' && (
                <div className="p-6 md:p-10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-light text-text-primary tracking-tight">
                      Shaxsiy Ma'lumotlar
                    </h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="group px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-lg hover:shadow-soft-hover transition-all duration-300 flex items-center gap-2"
                      >
                        <PencilIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        TAHRIRLASH
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2.5 tracking-wide">
                            To'liq Ism
                          </label>
                          <input
                            type="text"
                            value={userInfo.full_name}
                            onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                            className="w-full px-4 py-3.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-light transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2.5 tracking-wide">
                            Email
                          </label>
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            className="w-full px-4 py-3.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-light transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2.5 tracking-wide">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            className="w-full px-4 py-3.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-light transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:shadow-soft-hover transition-all duration-300"
                        >
                          SAQLASH
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            loadUserData();
                          }}
                          className="flex-1 px-6 py-3.5 bg-surface-light text-text-primary font-medium rounded-lg hover:bg-surface-gray transition-all duration-300"
                        >
                          BEKOR QILISH
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      {/* Profile Picture & Name */}
                      <div className="flex items-center gap-6 pb-8 border-b border-border-light">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-4xl font-light shadow-lg">
                          {userInfo.full_name.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-light text-text-primary mb-2">
                            {userInfo.full_name || user?.username || 'Foydalanuvchi'}
                          </h3>
                          <p className="text-sm text-text-secondary font-light">
                            Profil so'nggi o'zgartirilgan: {new Date().toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { label: "To'liq Ism", value: userInfo.full_name },
                          { label: "Email", value: userInfo.email },
                          { label: "Telefon", value: userInfo.phone },
                          { label: "Foydalanuvchi nomi", value: user?.username }
                        ].map((field, index) => (
                          <div
                            key={index}
                            className="p-5 bg-gradient-to-br from-surface-light to-white rounded-lg border border-border-light hover:shadow-soft transition-all duration-300"
                          >
                            <p className="text-xs text-text-secondary font-medium mb-2 uppercase tracking-wider">
                              {field.label}
                            </p>
                            <p className="text-base text-text-primary font-light">
                              {field.value || 'Kiritilmagan'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6 md:p-10 animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-light text-text-primary tracking-tight mb-8">
                    Buyurtmalar Tarixi
                  </h2>

                  {loading ? (
                    <div className="text-center py-20">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                      <p className="mt-4 text-text-secondary font-light">Yuklanmoqda...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-br from-surface-light to-white rounded-xl border-2 border-dashed border-border-light">
                      <ShoppingBagIcon className="w-20 h-20 mx-auto mb-4 text-text-tertiary" />
                      <h3 className="text-xl font-light text-text-primary mb-2">
                        Buyurtmalar yo'q
                      </h3>
                      <p className="text-text-secondary font-light mb-6">
                        Siz hali buyurtma bermagansiz
                      </p>
                      <Link
                        to="/products"
                        className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 font-medium rounded-lg hover:shadow-soft-hover transition-all duration-300"
                      >
                        XARID QILISH
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div
                            key={order.id}
                            className="border border-border-light rounded-xl p-6 hover:shadow-soft-lg hover:border-primary-200 transition-all duration-300 bg-white"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
                              <div>
                                <h3 className="text-lg font-medium text-text-primary mb-1">
                                  Buyurtma #{order.id}
                                </h3>
                                <p className="text-sm text-text-secondary font-light">
                                  {new Date(order.created_at).toLocaleDateString('uz-UZ', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border rounded-full ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {order.status_display || statusConfig.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-2">
                              {order.items.slice(0, 4).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-border-light hover:border-primary-300 transition-all"
                                >
                                  <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                              {order.items.length > 4 && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-border-light flex items-center justify-center">
                                  <span className="text-sm text-text-secondary font-medium">
                                    +{order.items.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-border-light">
                              <p className="text-xl font-medium text-text-primary">
                                {order.total_price.toLocaleString()} so'm
                              </p>
                              <div className="flex gap-3">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="px-5 py-2.5 text-sm border-2 border-border-light text-text-primary font-medium rounded-lg hover:border-accent-600 hover:text-accent-600 transition-all"
                                  >
                                    BEKOR QILISH
                                  </button>
                                )}
                                <Link
                                  to={`/orders/${order.id}`}
                                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-lg hover:shadow-soft-hover transition-all"
                                >
                                  BATAFSIL
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-6 md:p-10 animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-light text-text-primary tracking-tight mb-8">
                    Sevimli Mahsulotlar
                  </h2>

                  {loading ? (
                    <div className="text-center py-20">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                      <p className="mt-4 text-text-secondary font-light">Yuklanmoqda...</p>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-br from-surface-light to-white rounded-xl border-2 border-dashed border-border-light">
                      <HeartIconSolid className="w-20 h-20 mx-auto mb-4 text-accent-300" />
                      <h3 className="text-xl font-light text-text-primary mb-2">
                        Sevimli mahsulotlar yo'q
                      </h3>
                      <p className="text-text-secondary font-light mb-6">
                        Mahsulotlarni sevimlilar ro'yxatiga qo'shing
                      </p>
                      <Link
                        to="/products"
                        className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 font-medium rounded-lg hover:shadow-soft-hover transition-all duration-300"
                      >
                        MAHSULOTLARNI KO'RISH
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {wishlist.map((item) => (
                        <div key={item.id} className="group">
                          <Link to={`/products/${item.product.slug}`}>
                            <div className="aspect-[3/4] bg-surface-light mb-3 overflow-hidden rounded-xl border border-border-light group-hover:border-primary-300 transition-all duration-300 relative">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-accent-50 transition-colors">
                                  <HeartIconSolid className="w-5 h-5 text-accent-600" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-sm font-light text-text-primary mb-1.5 line-clamp-2">
                              {item.product.name}
                            </h3>
                            <p className="text-base font-medium text-text-primary">
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
                <div className="p-6 md:p-10 animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-light text-text-primary tracking-tight mb-8">
                    Sozlamalar
                  </h2>

                  <div className="space-y-5">
                    {/* Password Section */}
                    <div className="border border-border-light rounded-xl p-6 hover:shadow-soft-md transition-all bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-text-primary mb-2">
                            Parol
                          </h3>
                          <p className="text-sm text-text-secondary font-light mb-4">
                            Hisobingiz xavfsizligini ta'minlash uchun parolni yangilang
                          </p>
                        </div>
                        <button className="px-5 py-2.5 border-2 border-primary-600 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300">
                          O'ZGARTIRISH
                        </button>
                      </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="border border-border-light rounded-xl p-6 hover:shadow-soft-md transition-all bg-white">
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        Bildirishnomalar
                      </h3>
                      <p className="text-sm text-text-secondary font-light mb-5">
                        Email va SMS bildirishnomalarni boshqaring
                      </p>
                      <div className="space-y-4">
                        {[
                          { label: 'Buyurtma yangilanishlari', checked: true },
                          { label: 'Yangi mahsulotlar va chegirmalar', checked: true },
                          { label: 'Haftalik yangiliknoma', checked: false }
                        ].map((notification, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-light transition-all cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              defaultChecked={notification.checked}
                              className="w-5 h-5 text-primary-600 border-border-light rounded focus:ring-primary-500 transition-all"
                            />
                            <span className="text-sm font-light text-text-primary">
                              {notification.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Logout Section */}
                    <div className="border-2 border-rose-200 rounded-xl p-6 bg-gradient-to-br from-rose-50 to-white hover:shadow-soft-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-text-primary mb-2">
                            Hisobdan chiqish
                          </h3>
                          <p className="text-sm text-text-secondary font-light mb-4">
                            Profilingizdan chiqish uchun tugmani bosing
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="group px-5 py-2.5 bg-gradient-to-r from-accent-600 to-rose-600 text-white text-sm font-medium rounded-lg hover:shadow-soft-hover transition-all duration-300 flex items-center gap-2"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          CHIQISH
                        </button>
                      </div>
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
