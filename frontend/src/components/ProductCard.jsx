import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

/**
 * Professional Product Card Component
 * Features:
 * - Dual image on hover
 * - Wishlist functionality
 * - Dynamic badges (New, Sale, Featured)
 * - Smooth animations
 * - Responsive design
 * - Add to cart button
 */
function ProductCard({ product }) {
  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // TODO: Connect to backend wishlist

  // Calculate discounted price
  const discountedPrice = product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/products' } } });
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id, 1);
    setAddingToCart(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // TODO: Connect to backend wishlist API
    setIsFavorite(!isFavorite);
  };

  // Determine badge for product
  const getBadge = () => {
    if (product.product_type === 'new') {
      return { text: 'YANGI', color: 'bg-emerald-500' };
    }
    if (product.discount_percentage > 0 || product.product_type === 'discount') {
      return { text: `${product.discount_percentage}% CHEGIRMA`, color: 'bg-red-500' };
    }
    if (product.is_featured) {
      return { text: 'MASHHUR', color: 'bg-amber-500' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-gray-50"
      >
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered && product.image_2 ? 'opacity-0 scale-110' : 'opacity-100 scale-100 group-hover:scale-110'
          }`}
        />

        {/* Alternate Image on Hover */}
        {product.image_2 && (
          <img
            src={product.image_2}
            alt={`${product.name} - alternate`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          />
        )}

        {/* Badge - Top Left */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-block px-3 py-1.5 ${badge.color} text-white text-xs font-semibold tracking-wider rounded-full shadow-lg`}>
              {badge.text}
            </span>
          </div>
        )}

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
          )}
        </button>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-6 py-3 bg-white text-gray-900 font-semibold text-sm tracking-wider">
              TUGALLANDI
            </span>
          </div>
        )}

        {/* Quick Add Button - Visible on Hover */}
        {product.stock > 0 && (
          <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed tracking-wider rounded-lg shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {addingToCart ? 'QO\'SHILMOQDA...' : 'SAVATGA QO\'SHISH'}
            </button>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2.5">
        {/* Product Name */}
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {product.category_name && (
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category_name}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          {product.discount_percentage > 0 ? (
            <>
              <span className="text-lg font-bold text-red-600">
                {formatPrice(discountedPrice)} so'm
              </span>
              <span className="text-sm text-gray-400 line-through font-normal">
                {formatPrice(product.price)} so'm
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)} so'm
            </span>
          )}
        </div>

        {/* Colors & Sizes Preview */}
        {(product.colors?.length > 0 || product.sizes?.length > 0) && (
          <div className="flex items-center gap-3 pt-2 text-xs text-gray-600">
            {product.colors?.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{product.colors.length}</span>
                <span>rang{product.colors.length > 1 ? 'lar' : ''}</span>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{product.sizes.length}</span>
                <span>o'lcham{product.sizes.length > 1 ? 'lar' : ''}</span>
              </div>
            )}
          </div>
        )}

        {/* Rating (Optional - for future) */}
        {/* <div className="flex items-center gap-1.5 pt-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">(24)</span>
        </div> */}

        {/* Stock Indicator */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 font-medium pt-1">
            Faqat {product.stock} dona qoldi!
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
