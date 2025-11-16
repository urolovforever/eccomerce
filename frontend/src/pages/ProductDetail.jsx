import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductBySlug, getProducts } from '../api/api';
import ProductGrid from '../components/ProductGrid';
import {
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  ChevronLeftIcon,
  MagnifyingGlassPlusIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

/**
 * Modern Product Detail Page
 *
 * Features:
 * - Image gallery with zoom
 * - Size and color selection
 * - Quantity selector
 * - Add to cart
 * - Wishlist
 * - Product information tabs
 * - Related products
 * - Responsive design
 */
function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Image gallery
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Product selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // UI states
  const [activeTab, setActiveTab] = useState('details'); // details, shipping, reviews
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await getProductBySlug(slug);
      const productData = response.data;
      setProduct(productData);
      setSelectedImage(productData.image);

      // Auto-select first available color and size
      if (productData.colors?.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      if (productData.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }

      // Load related products from same category
      loadRelatedProducts(productData.category);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (categoryId) => {
    try {
      const response = await getProducts({ category: categoryId, limit: 4 });
      // Filter out current product
      const filtered = response.data.results.filter(p => p.slug !== slug);
      setRelatedProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

  const discountedPrice = product?.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product?.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${slug}` } } });
      return;
    }

    if (!selectedSize && product.sizes?.length > 0) {
      alert('Iltimos, o\'lchamni tanlang');
      return;
    }

    if (!selectedColor && product.colors?.length > 0) {
      alert('Iltimos, rangni tanlang');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO: Connect to backend wishlist API
    setIsFavorite(!isFavorite);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Mahsulot topilmadi</h2>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
          Mahsulotlar sahifasiga qaytish
        </Link>
      </div>
    );
  }

  const images = [product.image, product.image_2, product.image_3].filter(Boolean);

  // Get badge info
  const getBadge = () => {
    if (product.product_type === 'new') {
      return { text: 'YANGI', color: 'bg-primary-600' };
    }
    if (product.discount_percentage > 0) {
      return { text: `${product.discount_percentage}% CHEGIRMA`, color: 'bg-accent-600' };
    }
    if (product.is_featured) {
      return { text: 'MASHHUR', color: 'bg-gold-600' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div className="bg-surface-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Mahsulotlar</Link>
          <span>/</span>
          {product.category_name && (
            <>
              <span className="hover:text-primary-600 transition-colors">{product.category_name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-surface-white rounded-lg overflow-hidden shadow-soft-lg group">
              <div className="aspect-[3/4] relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge */}
                {badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-block px-4 py-2 ${badge.color} text-white text-sm font-semibold tracking-wider rounded-full shadow-lg`}>
                      {badge.text}
                    </span>
                  </div>
                )}

                {/* Zoom Icon */}
                <button
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 z-10"
                >
                  <MagnifyingGlassPlusIcon className="w-5 h-5 text-gray-700" />
                </button>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="px-8 py-4 bg-white text-gray-900 font-bold text-lg tracking-wider">
                      TUGALLANDI
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[3/4] overflow-hidden rounded-lg transition-all duration-200 ${
                      selectedImage === img
                        ? 'ring-2 ring-primary-600 shadow-soft-md'
                        : 'ring-1 ring-border-light hover:ring-primary-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-2">
                  {product.name}
                </h1>
                {product.category_name && (
                  <p className="text-sm text-text-secondary uppercase tracking-wider">
                    {product.category_name}
                  </p>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleFavorite}
                className="p-3 bg-surface-white border border-border-light rounded-full shadow-soft hover:shadow-soft-md transition-all duration-200 hover:scale-110"
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-6 h-6 text-accent-600" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600 hover:text-accent-600 transition-colors" />
                )}
              </button>
            </div>

            {/* Rating (placeholder for future) */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'text-gold-600' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">(24 ta sharh)</span>
            </div>

            {/* Price */}
            <div className="bg-surface-white p-6 rounded-lg border border-border-light">
              {product.discount_percentage > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-accent-600">
                      {formatPrice(discountedPrice)} so'm
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price)} so'm
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-600 px-4 py-2 rounded-button text-sm font-semibold">
                    <span>Tejaysiz: {formatPrice(product.price - discountedPrice)} so'm</span>
                  </div>
                </div>
              ) : (
                <span className="text-4xl font-bold text-text-primary">
                  {formatPrice(product.price)} so'm
                </span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                  Rang: <span className="text-text-secondary font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-button text-sm font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-border-light hover:border-primary-600 text-text-secondary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                  O'lcham: <span className="text-text-secondary font-normal">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 border-2 rounded-button text-sm font-semibold transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-border-light hover:border-primary-600 text-text-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                  Miqdor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-border-light rounded-button overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusIcon className="w-5 h-5 text-text-primary" />
                    </button>
                    <span className="px-6 py-2 text-lg font-semibold text-text-primary min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="w-5 h-5 text-text-primary" />
                    </button>
                  </div>
                  {product.stock <= 10 && (
                    <span className="text-sm text-orange-600 font-medium">
                      Faqat {product.stock} dona qoldi!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-4 bg-gray-900 text-white text-lg font-semibold hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed tracking-wider rounded-button shadow-soft-lg hover:shadow-soft-hover flex items-center justify-center gap-3"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {addingToCart ? 'QO\'SHILMOQDA...' : 'SAVATGA QO\'SHISH'}
              </button>
            ) : (
              <div className="w-full py-4 bg-gray-200 text-gray-600 text-lg font-semibold text-center rounded-button">
                TUGALLANDI
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-light">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <TruckIcon className="w-5 h-5 text-primary-600" />
                <span>Bepul yetkazib berish</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                <span>Kafolat</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <ArrowsRightLeftIcon className="w-5 h-5 text-primary-600" />
                <span>14 kun ichida qaytarish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-surface-white rounded-lg shadow-soft-md overflow-hidden mb-16">
          {/* Tab Headers */}
          <div className="flex border-b border-border-light">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'details'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-text-secondary hover:text-primary-600'
              }`}
            >
              Ma'lumotlar
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'shipping'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-text-secondary hover:text-primary-600'
              }`}
            >
              Yetkazib berish
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-text-secondary hover:text-primary-600'
              }`}
            >
              Sharhlar (24)
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary mb-4">Mahsulot haqida</h3>
                <p className="text-text-secondary leading-relaxed">{product.description}</p>

                <div className="grid grid-cols-2 gap-4 pt-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">SKU</h4>
                    <p className="text-text-secondary">{product.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Kategoriya</h4>
                    <p className="text-text-secondary">{product.category_name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Ranglar</h4>
                    <p className="text-text-secondary">{product.colors?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">O'lchamlar</h4>
                    <p className="text-text-secondary">{product.sizes?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">Yetkazib berish</h3>
                  <div className="space-y-3 text-text-secondary">
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Bepul yetkazib berish 500,000 so'mdan yuqori buyurtmalar uchun</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Standart yetkazib berish: 3-5 ish kuni</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Tezkor yetkazib berish: 1-2 ish kuni</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">Qaytarish</h3>
                  <div className="space-y-3 text-text-secondary">
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>14 kun ichida bepul qaytarish</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Mahsulot yangi va foydalanilmagan bo'lishi kerak</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Asl qadoqda qaytarilishi shart</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">Mijozlar sharhlari</h3>

                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 bg-surface-light rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-text-primary mb-2">4.5</div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`w-5 h-5 ${i < 4 ? 'text-gold-600' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary">24 ta sharh</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary w-12">{stars} yulduz</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-600"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-text-secondary w-8">{stars === 5 ? 17 : stars === 4 ? 5 : 2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-border-light pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                          M
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-text-primary">Malika</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid key={i} className="w-4 h-4 text-gold-600" />
                              ))}
                            </div>
                            <span className="text-sm text-text-secondary">2 kun oldin</span>
                          </div>
                          <p className="text-text-secondary leading-relaxed">
                            Mahsulot juda zo'r! Sifati a'lo, narxi ham mos. Yetkazib berish tez bo'ldi. Tavsiya qilaman!
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-8">O'xshash mahsulotlar</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
            onClick={() => setIsImageZoomed(false)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
