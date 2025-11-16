import { useEffect } from 'react';

function FilterSidebar({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount
}) {
  const colorOptions = [
    { value: 'qora', label: 'Qora' },
    { value: 'oq', label: 'Oq' },
    { value: 'qizil', label: 'Qizil' },
    { value: "ko'k", label: "Ko'k" },
    { value: 'yashil', label: 'Yashil' },
    { value: 'sariq', label: 'Sariq' },
    { value: 'pushti', label: 'Pushti' },
    { value: 'jigarrang', label: 'Jigarrang' },
    { value: 'kulrang', label: 'Kulrang' },
    { value: "to'q-ko'k", label: "To'q ko'k" },
    { value: 'binafsha', label: 'Binafsha' },
    { value: 'apelsin', label: 'Apelsin' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  // Escape tugmasi bilan yopish
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body scroll'ni bloklash
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-gray-900 tracking-wide">Filterlar</h2>
            <p className="text-sm text-gray-500 font-light mt-1">{resultCount} ta mahsulot</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Yopish"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Kategoriya */}
          <div>
            <label className="block text-sm font-light text-gray-900 mb-4 tracking-wide uppercase">
              Kategoriya
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onCategoryChange(null)}
                className={`w-full text-left px-4 py-3 text-sm font-light transition-all ${
                  !selectedCategory
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                Barchasi
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  className={`w-full text-left px-4 py-3 text-sm font-light transition-all flex items-center justify-between ${
                    selectedCategory === category.slug
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  {category.product_count && (
                    <span className={`text-xs px-2 py-0.5 ${
                      selectedCategory === category.slug
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.product_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Narx Oralig'i */}
          <div>
            <label className="block text-sm font-light text-gray-900 mb-4 tracking-wide uppercase">
              Narx Oralig'i
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2 font-light">Minimal narx (so'm)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-gray-900 font-light"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2 font-light">Maksimal narx (so'm)</label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-gray-900 font-light"
                />
              </div>
            </div>
          </div>

          {/* Rang */}
          <div>
            <label className="block text-sm font-light text-gray-900 mb-4 tracking-wide uppercase">
              Rang
            </label>
            <select
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all appearance-none bg-white text-gray-900 font-light"
            >
              <option value="">Barchasi</option>
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          {/* O'lcham */}
          <div>
            <label className="block text-sm font-light text-gray-900 mb-4 tracking-wide uppercase">
              O'lcham
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSizeChange('')}
                className={`px-4 py-2 text-sm font-light transition-all ${
                  !selectedSize
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Barchasi
              </button>
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`px-4 py-2 text-sm font-light transition-all ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sortlash */}
          <div>
            <label className="block text-sm font-light text-gray-900 mb-4 tracking-wide uppercase">
              Saralash
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all appearance-none bg-white text-gray-900 font-light"
            >
              <option value="">Standart</option>
              <option value="price_asc">Narx: Arzondan qimmatga</option>
              <option value="price_desc">Narx: Qimmatdan arzonga</option>
              <option value="name_asc">Nomi: A-Z</option>
              <option value="name_desc">Nomi: Z-A</option>
              <option value="newest">Eng yangilari</option>
              <option value="oldest">Eng eskilari</option>
              <option value="popular">Mashhur</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          <button
            onClick={onReset}
            className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-none font-light hover:bg-gray-200 transition-colors tracking-wide"
          >
            Filterlarni tozalash
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-none font-light hover:bg-gray-800 transition-colors tracking-wide"
          >
            NATIJALARNI KO'RISH
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;
