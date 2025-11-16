import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, priceRange.min, priceRange.max, selectedColor, selectedSize, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      const categoriesData = response.data.results || response.data;
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Kategoriyalar yuklanmadi:', error);
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      const queryParams = new URLSearchParams(location.search);

      // Check for URL params
      if (queryParams.get('new') === 'true') {
        params.ordering = '-created_at';
      }
      if (queryParams.get('sale') === 'true') {
        // Filter products with discount
        params.discount = true;
      }
      if (queryParams.get('category')) {
        setSelectedCategory(queryParams.get('category'));
        params.category = queryParams.get('category');
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (priceRange.min && priceRange.min !== '') {
        params.min_price = priceRange.min;
      }
      if (priceRange.max && priceRange.max !== '') {
        params.max_price = priceRange.max;
      }

      if (selectedColor) {
        params.color = selectedColor;
      }

      if (selectedSize) {
        params.size = selectedSize;
      }

      if (sortBy) {
        const orderingMap = {
          'price_asc': 'price',
          'price_desc': '-price',
          'name_asc': 'name',
          'name_desc': '-name',
          'newest': '-created_at',
          'oldest': 'created_at',
          'popular': '-is_featured'
        };
        params.ordering = orderingMap[sortBy];
      }

      const response = await getProducts(params);
      const productsData = response.data.results || response.data;

      if (Array.isArray(productsData)) {
        setAllProducts(productsData);
        setProducts(productsData);
        setItemsToShow(12); // Reset pagination
      } else {
        setAllProducts([]);
        setProducts([]);
      }
    } catch (error) {
      console.error('Mahsulotlar yuklanmadi:', error);
      setError('Mahsulotlar yuklanmadi.');
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSelectedColor('');
    setSelectedSize('');
    setSortBy('');
  };

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 12);
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceRange.min || priceRange.max || selectedColor || selectedSize || sortBy;
  const queryParams = new URLSearchParams(location.search);
  const isNewArrivals = queryParams.get('new') === 'true';
  const isSale = queryParams.get('sale') === 'true';
  const displayedProducts = products.slice(0, itemsToShow);
  const hasMore = itemsToShow < products.length;

  return (
    <div>
      {/* Banner Section - Only for New Arrivals */}
      {isNewArrivals && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
                Yangi Kolleksiya
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Eng so'nggi va zamonaviy mahsulotlar bilan tanishing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sale Banner */}
      {isSale && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
                Chegirmadagi Mahsulotlar
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Endi qulay narxlarda xarid qiling
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header with Filter Button */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
              {isNewArrivals ? 'Yangiliklar' : isSale ? 'Chegirmadagilar' : 'Barcha Mahsulotlar'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-light">
              {loading ? 'Yuklanmoqda...' : `${products.length} ta mahsulot`}
              {hasActiveFilters && !loading && ' (filtrlangan)'}
            </p>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors font-light text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-white text-gray-900 text-xs px-2 py-0.5 rounded-full font-medium">
                {[selectedCategory, searchQuery, priceRange.min, priceRange.max, selectedColor, selectedSize, sortBy].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

        {/* Quick Filters - Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs md:text-sm text-gray-600 font-light">Faol filterlar:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-light rounded-full text-xs md:text-sm">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="hover:text-gray-700">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {priceRange.min && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-light rounded-full text-xs md:text-sm">
                Dan: {parseInt(priceRange.min).toLocaleString()} so'm
                <button onClick={() => setPriceRange({...priceRange, min: ''})} className="hover:text-gray-700">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {priceRange.max && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-light rounded-full text-xs md:text-sm">
                Gacha: {parseInt(priceRange.max).toLocaleString()} so'm
                <button onClick={() => setPriceRange({...priceRange, max: ''})} className="hover:text-gray-700">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-light rounded-full text-xs md:text-sm">
                Rang: {selectedColor}
                <button onClick={() => setSelectedColor('')} className="hover:text-gray-700">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-light rounded-full text-xs md:text-sm">
                O'lcham: {selectedSize}
                <button onClick={() => setSelectedSize('')} className="hover:text-gray-700">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs md:text-sm text-gray-900 hover:text-gray-700 underline font-light"
            >
              Hammasini tozalash
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-900 font-light">Yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 p-8">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-2 font-light">Mahsulot topilmadi</p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-none hover:bg-gray-800 font-light"
              >
                Filterlarni tozalash
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-12 py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors font-light text-sm tracking-wider"
                >
                  KO'PROQ YUKLASH
                </button>
                <p className="mt-3 text-sm text-gray-500 font-light">
                  {displayedProducts.length} / {products.length} ko'rsatilmoqda
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        resultCount={products.length}
      />
    </div>
  );
}

export default Products;
