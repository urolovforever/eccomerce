import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await api.get('/products/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Load cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Savatga qo\'shish uchun tizimga kiring',
      };
    }

    try {
      const response = await api.post('/products/cart/add/', {
        product_id: productId,
        quantity,
      });
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Savatga qo\'shishda xatolik',
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return;

    try {
      const response = await api.put(`/products/cart/items/${itemId}/update/`, {
        quantity,
      });
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Yangilashda xatolik',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    try {
      const response = await api.delete(`/products/cart/items/${itemId}/remove/`);
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'O\'chirishda xatolik',
      };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.delete('/products/cart/clear/');
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Tozalashda xatolik',
      };
    }
  };

  const getCartCount = () => {
    return cart?.total_items || 0;
  };

  const getCartTotal = () => {
    return cart?.total_price || 0;
  };

  const value = {
    cart,
    loading,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
