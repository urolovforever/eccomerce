import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  TruckIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-light via-white to-surface-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-text-secondary font-light">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-white to-surface-light py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-soft-lg border border-border-light p-12 md:p-16 text-center animate-fadeIn">
            {/* Empty Cart Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCartIcon className="w-16 h-16 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-4 tracking-tight">
                Savatingiz bo'sh
              </h2>
              <p className="text-lg text-text-secondary font-light mb-8 max-w-md mx-auto">
                Savatga mahsulot qo'shish uchun do'konni ko'rib chiqing va o'zingizga yoqqan narsalarni tanlang
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-soft-hover transition-all duration-300"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Xarid qilishni boshlash
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border-2 border-border-light text-text-primary px-8 py-3.5 rounded-lg font-medium hover:border-primary-300 hover:bg-surface-light transition-all duration-300"
              >
                Bosh sahifa
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-white to-surface-light py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight mb-2">
                Savatingiz
              </h1>
              <p className="text-base text-text-secondary font-light">
                {cart.total_items} ta mahsulot
              </p>
            </div>
            {cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="group inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium transition-colors px-4 py-2 border border-accent-200 rounded-lg hover:bg-accent-50"
              >
                <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Savatni tozalash
              </button>
            )}
          </div>

          {/* Back to Shopping Link */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-light transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Xaridni davom ettirish
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-soft-md border border-border-light p-4 md:p-6 hover:shadow-soft-lg hover:border-primary-200 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product_slug || item.product_id}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-border-light bg-surface-light">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product_slug || item.product_id}`}
                          className="block"
                        >
                          <h3 className="text-base md:text-lg font-medium text-text-primary mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
                            {item.product_name}
                          </h3>
                        </Link>

                        {/* Size and Color if available */}
                        {(item.size || item.color) && (
                          <div className="flex items-center gap-3 text-sm text-text-secondary mb-2">
                            {item.size && (
                              <span className="px-2 py-1 bg-surface-light rounded text-xs">
                                O'lcham: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-2 py-1 bg-surface-light rounded text-xs">
                                Rang: {item.color}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Remove Button - Desktop */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="hidden md:flex items-center justify-center w-9 h-9 text-text-secondary hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all"
                        aria-label="O'chirish"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Price */}
                      <div className="flex flex-col gap-1">
                        {item.product_discount > 0 ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-lg md:text-xl font-bold text-accent-600">
                                {item.discounted_price.toLocaleString()} so'm
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 bg-accent-600 text-white text-xs font-semibold rounded-full">
                                -{item.product_discount}%
                              </span>
                            </div>
                            <span className="text-sm text-text-tertiary line-through">
                              {item.product_price.toLocaleString()} so'm
                            </span>
                          </>
                        ) : (
                          <span className="text-lg md:text-xl font-bold text-text-primary">
                            {item.product_price.toLocaleString()} so'm
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-border-light rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2.5 hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Kamaytirish"
                          >
                            <MinusIcon className="w-4 h-4 text-text-primary" />
                          </button>
                          <span className="px-4 py-2.5 min-w-[60px] text-center font-medium border-x-2 border-border-light">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                            className="p-2.5 hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Oshirish"
                          >
                            <PlusIcon className="w-4 h-4 text-text-primary" />
                          </button>
                        </div>

                        {/* Remove Button - Mobile */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="md:hidden flex items-center gap-2 text-sm text-accent-600 hover:text-accent-700 font-medium"
                        >
                          <TrashIcon className="w-5 h-5" />
                          O'chirish
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary font-light">
                          Oraliq jami:
                        </span>
                        <span className="text-lg font-bold text-text-primary">
                          {item.subtotal.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft-lg border border-border-light p-6 sticky top-24">
              <h3 className="text-xl md:text-2xl font-light text-text-primary mb-6 tracking-tight">
                Buyurtma ma'lumotlari
              </h3>

              {/* Summary Items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <span className="text-base text-text-secondary font-light flex items-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5" />
                    Mahsulotlar ({cart.total_items})
                  </span>
                  <span className="text-base font-medium text-text-primary">
                    {cart.total_price.toLocaleString()} so'm
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border-light">
                  <span className="text-base text-text-secondary font-light flex items-center gap-2">
                    <TruckIcon className="w-5 h-5" />
                    Yetkazib berish
                  </span>
                  <span className="text-base font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircleIcon className="w-5 h-5" />
                    Bepul
                  </span>
                </div>

                {/* Total */}
                <div className="py-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg px-4 border border-primary-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-text-primary">
                      Jami to'lov:
                    </span>
                    <span className="text-2xl font-bold text-primary-700">
                      {cart.total_price.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-4 rounded-lg font-medium hover:shadow-soft-hover transition-all duration-300 mb-3 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buyurtma berish
                </span>
              </Link>

              {/* Continue Shopping Link */}
              <Link
                to="/products"
                className="block w-full text-center text-primary-600 hover:text-primary-700 py-3 font-light hover:bg-primary-50 rounded-lg transition-all"
              >
                Xaridni davom ettirish
              </Link>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border-light space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Bepul yetkazib berish
                    </p>
                    <p className="text-xs text-text-secondary font-light">
                      Barcha buyurtmalar uchun
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TruckIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Tez yetkazish
                    </p>
                    <p className="text-xs text-text-secondary font-light">
                      2-3 kun ichida yetkazamiz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
