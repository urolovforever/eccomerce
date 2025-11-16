import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    if (confirm('Ushbu mahsulotni savatdan o\'chirmoqchimisiz?')) {
      await removeFromCart(itemId);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Savatni butunlay tozalamoqchimisiz?')) {
      await clearCart();
    }
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Savatingiz bo'sh
            </h2>
            <p className="text-gray-600 mb-6">
              Savatga mahsulot qo'shish uchun do'konni ko'rib chiqing
            </p>
            <Link
              to="/products"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Xarid qilishni boshlash
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Savat</h1>
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Savatni tozalash
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-6 flex gap-6"
              >
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.product_name}
                  </h3>

                  <div className="flex items-center gap-4 mb-3">
                    {item.product_discount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-purple-600">
                          {item.discounted_price.toLocaleString()} so'm
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.product_price.toLocaleString()} so'm
                        </span>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                          -{item.product_discount}%
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-purple-600">
                        {item.product_price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {item.subtotal.toLocaleString()} so'm
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Buyurtma ma'lumotlari
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Mahsulotlar ({cart.total_items}):</span>
                  <span>{cart.total_price.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Yetkazib berish:</span>
                  <span className="text-green-600">Bepul</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Jami:</span>
                    <span className="text-purple-600">
                      {cart.total_price.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700 transition mb-3"
              >
                Buyurtma berish
              </Link>

              <Link
                to="/products"
                className="block w-full text-center text-purple-600 hover:text-purple-700 py-2"
              >
                ← Xaridni davom ettirish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
