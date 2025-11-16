import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categoryScrollRef = useRef(null);
  const newProductsScrollRef = useRef(null);
  const saleProductsScrollRef = useRef(null);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Yangi Mavsum Kolleksiyasi",
      subtitle: "Zamonaviy dizayn va yuqori sifat",
      cta: "Mahsulotlarni ko'rish",
      bgColor: "from-stone-100 to-stone-50"
    },
    {
      id: 2,
      title: "Eksklyuziv Chegirmalar",
      subtitle: "50% gacha chegirma",
      cta: "Mahsulotlarni ko'rish",
      bgColor: "from-rose-50 to-pink-50"
    },
    {
      id: 3,
      title: "Premium Kolleksiya",
      subtitle: "Siz uchun eng yaxshisi",
      cta: "Mahsulotlarni ko'rish",
      bgColor: "from-amber-50 to-orange-50"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Auto-play hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getFeaturedProducts(),
        getCategories()
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Xatolik:', error);
      setError('Backend bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const newProducts = featuredProducts.filter(p => p.is_new || p.is_featured).slice(0, 8);
  const saleProducts = featuredProducts.filter(p => p.discount_percentage > 0).slice(0, 8);

  return (
    <div className="bg-white">
      {/* Hero Carousel Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${slide.bgColor} flex items-center justify-center`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 font-light">
                  {slide.subtitle}
                </p>
                <Link
                  to="/products"
                  className="inline-block px-10 py-4 bg-gray-900 text-white text-sm font-light tracking-wide hover:bg-gray-800 transition-colors duration-300"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/80 hover:bg-white text-gray-900 transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/80 hover:bg-white text-gray-900 transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-gray-900 w-8' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Carousel Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-tight">
                Kategoriyalar
              </h2>
              <p className="text-gray-600 font-light">
                O'zingizga mos bo'lgan kategoriyani tanlang
              </p>
            </div>

            <div className="relative">
              {/* Scroll buttons */}
              {categories.length > 4 && (
                <>
                  <button
                    onClick={() => scroll(categoryScrollRef, 'left')}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll(categoryScrollRef, 'right')}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Categories scroll container */}
              <div
                ref={categoryScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="group flex-shrink-0 w-64 h-80 relative overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-light mb-1 group-hover:translate-y-[-4px] transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/80 font-light">
                        {category.product_count} mahsulot
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Products Section (Yangiliklar) */}
      {newProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-tight">
                  Yangiliklar
                </h2>
                <p className="text-gray-600 font-light">
                  Eng so'nggi kolleksiyalar
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Scroll buttons */}
              {newProducts.length > 4 && (
                <>
                  <button
                    onClick={() => scroll(newProductsScrollRef, 'left')}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll(newProductsScrollRef, 'right')}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Products scroll container */}
              <div
                ref={newProductsScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {newProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/products?new=true"
                className="inline-block px-10 py-3 border border-gray-900 text-gray-900 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                Barchasi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sale Products Section (Chegirmadagilar) */}
      {saleProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-tight">
                  Chegirmadagilar
                </h2>
                <p className="text-gray-600 font-light">
                  Maxsus takliflar va chegirmalar
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Scroll buttons */}
              {saleProducts.length > 4 && (
                <>
                  <button
                    onClick={() => scroll(saleProductsScrollRef, 'left')}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll(saleProductsScrollRef, 'right')}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Products scroll container */}
              <div
                ref={saleProductsScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {saleProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/products?sale=true"
                className="inline-block px-10 py-3 border border-gray-900 text-gray-900 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                Barchasi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
