import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, priceRange.min, priceRange.max, sortBy]);

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
      
      if (sortBy) {
        const orderingMap = {
          'price_asc': 'price',
          'price_desc': '-price',
          'name_asc': 'name',
          'name_desc': '-name',
          'newest': '-created_at',
          'oldest': 'created_at'
        };
        params.ordering = orderingMap[sortBy];
      }
      
      const response = await getProducts(params);
      const productsData = response.data.results || response.data;
      
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Mahsulotlar yuklanmadi:', error);
      setError('Mahsulotlar yuklanmadi.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('');
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceRange.min || priceRange.max || sortBy;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Filter Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Mahsulotlar</h1>
          <p className="text-gray-600">
            {loading ? 'Yuklanmoqda...' : `${products.length} ta mahsulot`}
            {hasActiveFilters && !loading && ' (filtrlangan)'}
          </p>
        </div>
        
        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors shadow-soft-md hover:shadow-soft-lg font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold">Filter</span>
          {hasActiveFilters && (
            <span className="bg-white text-primary text-xs px-2 py-1 rounded-full font-bold">
              {[selectedCategory, searchQuery, priceRange.min, priceRange.max, sortBy].filter(Boolean).length}
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
          <span className="text-sm text-text-secondary font-semibold">Faol filterlar:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary font-semibold rounded-full text-sm">
              {categories.find(c => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)} className="hover:text-primary-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {priceRange.min && (
            <span className="inline-flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary font-semibold rounded-full text-sm">
              Dan: {parseInt(priceRange.min).toLocaleString()} so'm
              <button onClick={() => setPriceRange({...priceRange, min: ''})} className="hover:text-primary-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {priceRange.max && (
            <span className="inline-flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary font-semibold rounded-full text-sm">
              Gacha: {parseInt(priceRange.max).toLocaleString()} so'm
              <button onClick={() => setPriceRange({...priceRange, max: ''})} className="hover:text-primary-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-sm text-accent hover:text-accent/80 underline font-semibold"
          >
            Hammasini tozalash
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Mahsulot qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-primary"
        />
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-3 border-primary"></div>
          <p className="mt-4 text-text-primary font-semibold">Yuklanmoqda...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
          <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-2">Mahsulot topilmadi</p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Filterlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        resultCount={products.length}
      />
    </div>
  );
}

export default Products;
