import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const successMessage = location.state?.success;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (id) => {
    try {
      const response = await api.get(`/products/orders/${id}/`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Fetch order detail error:', error);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('Buyurtmani bekor qilmoqchimisiz?')) return;

    try {
      await api.post(`/products/orders/${id}/cancel/`);
      fetchOrders();
      if (selectedOrder?.id === id) {
        fetchOrderDetail(id);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      alert(error.response?.data?.error || 'Bekor qilishda xatolik');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Order Detail View
  if (orderId && selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Buyurtma muvaffaqiyatli yaratildi!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Tez orada operatorlarimiz siz bilan bog'lanishadi.
              </p>
            </div>
          )}

          <div className="mb-6">
            <Link
              to="/orders"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Barcha buyurtmalar
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Buyurtma #{selectedOrder.id}
                </h1>
                <p className="text-gray-600 mt-1">
                  {new Date(selectedOrder.created_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full font-medium ${getStatusBadge(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status_display}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Mijoz ma'lumotlari
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>{selectedOrder.full_name}</p>
                  <p>{selectedOrder.phone}</p>
                  <p>{selectedOrder.email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Yetkazib berish manzili
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>{selectedOrder.city}</p>
                  <p>{selectedOrder.address}</p>
                  {selectedOrder.postal_code && <p>{selectedOrder.postal_code}</p>}
                </div>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Izohlar</h3>
                <p className="text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Mahsulotlar</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product_name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {item.quantity} x {item.price.toLocaleString()} so'm
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {item.subtotal.toLocaleString()} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Jami:</span>
                <span className="text-purple-600">
                  {selectedOrder.total_price.toLocaleString()} so'm
                </span>
              </div>
            </div>

            {selectedOrder.status === 'pending' && (
              <div className="mt-6">
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Buyurtmani bekor qilish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mening buyurtmalarim
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Buyurtmalar yo'q
            </h2>
            <p className="text-gray-600 mb-6">
              Siz hali buyurtma bermagansiz
            </p>
            <Link
              to="/products"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Xarid qilishni boshlash
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Buyurtma #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status_display}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-gray-600 text-sm">
                      +{order.items.length - 3} ta ko'proq
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-purple-600">
                    {order.total_price.toLocaleString()} so'm
                  </p>
                  <div className="space-x-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Bekor qilish
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
