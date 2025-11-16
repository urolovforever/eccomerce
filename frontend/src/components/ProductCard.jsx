import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

  return (
    <div
      className="group relative bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered && product.image_2 ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:scale-105'
          }`}
        />

        {/* Alternate Image on Hover */}
        {product.image_2 && (
          <img
            src={product.image_2}
            alt={`${product.name} - alternate`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        )}

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-medium tracking-wide">
              -{product.discount_percentage}%
            </span>
          </div>
        )}

        {/* Quick Add Button - Visible on Hover */}
        <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full py-3 bg-white text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed tracking-wide"
          >
            {addingToCart ? 'QO\'SHILMOQDA...' : 'SAVATGA QO\'SHISH'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="py-4 space-y-2">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-sm font-light text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors tracking-wide">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {product.discount_percentage > 0 ? (
            <>
              <span className="text-base font-medium text-red-500">
                {formatPrice(discountedPrice)} so'm
              </span>
              <span className="text-sm text-gray-400 line-through font-light">
                {formatPrice(product.price)} so'm
              </span>
            </>
          ) : (
            <span className="text-base font-medium text-gray-900">
              {formatPrice(product.price)} so'm
            </span>
          )}
        </div>

        {/* External Links - Minimal */}
        {(product.uzum_link || product.yandex_market_link) && (
          <div className="flex gap-3 pt-1">
            {product.uzum_link && (
              <a
                href={product.uzum_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-gray-500 hover:text-gray-900 font-light underline transition-colors"
              >
                Uzum Market
              </a>
            )}
            {product.yandex_market_link && (
              <a
                href={product.yandex_market_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-gray-500 hover:text-gray-900 font-light underline transition-colors"
              >
                Yandex Market
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
