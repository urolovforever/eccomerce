import { useState, useEffect } from 'react';

function ProductFormModal({ product, categories, onSave, onClose }) {
  const isEditMode = Boolean(product);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    product_type: product?.product_type || 'regular',
    category: product?.category || '',
    description: product?.description || '',
    price: product?.price || '',
    discount_percentage: product?.discount_percentage || 0,
    stock: product?.stock || 0,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== undefined ? product.is_active : true,
  });

  const [selectedColors, setSelectedColors] = useState(product?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || []);

  const [imageFiles, setImageFiles] = useState({
    image: null,
    image_2: null,
    image_3: null,
  });

  const [previews, setPreviews] = useState({
    image: product?.image || null,
    image_2: product?.image_2 || null,
    image_3: product?.image_3 || null,
  });

  const colorOptions = [
    { value: 'qora', label: 'Qora' },
    { value: 'oq', label: 'Oq' },
    { value: 'qizil', label: 'Qizil' },
    { value: 'ko\'k', label: 'Ko\'k' },
    { value: 'yashil', label: 'Yashil' },
    { value: 'sariq', label: 'Sariq' },
    { value: 'pushti', label: 'Pushti' },
    { value: 'jigarrang', label: 'Jigarrang' },
    { value: 'kulrang', label: 'Kulrang' },
    { value: 'to\'q-ko\'k', label: 'To\'q ko\'k' },
    { value: 'binafsha', label: 'Binafsha' },
    { value: 'apelsin', label: 'Apelsin' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorToggle = (colorValue) => {
    setSelectedColors(prev => {
      if (prev.includes(colorValue)) {
        return prev.filter(c => c !== colorValue);
      } else {
        return [...prev, colorValue];
      }
    });
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (selectedColors.length === 0) {
      alert('Kamida bitta rang tanlang!');
      return;
    }

    if (selectedSizes.length === 0) {
      alert('Kamida bitta o\'lcham tanlang!');
      return;
    }

    if (!isEditMode && !imageFiles.image) {
      alert('Asosiy rasmni yuklang!');
      return;
    }

    const submitData = new FormData();

    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add colors and sizes as JSON
    submitData.append('colors', JSON.stringify(selectedColors));
    submitData.append('sizes', JSON.stringify(selectedSizes));

    // Add image files if they were changed
    Object.keys(imageFiles).forEach(key => {
      if (imageFiles[key]) {
        submitData.append(key, imageFiles[key]);
      }
    });

    if (isEditMode) {
      onSave(product.id, submitData);
    } else {
      onSave(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-wood-900">
            {isEditMode ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mahsulot nomi *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mahsulot turi *
              </label>
              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
              >
                <option value="regular">Oddiy</option>
                <option value="new">Yangi</option>
                <option value="discount">Chegirmadagi</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategoriya *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
          </div>

          {/* Price, Discount, and Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Narx (so'm) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chegirma (%)
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miqdor *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ranglar * (kamida bitta tanlang)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <label
                  key={color.value}
                  className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.value)}
                    onChange={() => handleColorToggle(color.value)}
                    className="rounded text-wood-600 focus:ring-wood-500"
                  />
                  <span className="text-sm">{color.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O'lchamlar * (kamida bitta tanlang)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {sizeOptions.map(size => (
                <label
                  key={size}
                  className="flex items-center justify-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="mr-2 rounded text-wood-600 focus:ring-wood-500"
                  />
                  <span className="text-sm font-medium">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-3 gap-4">
            {['image', 'image_2', 'image_3'].map((fieldName, index) => (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasm {index + 1} {index === 0 && !isEditMode ? '*' : ''}
                </label>
                <div className="space-y-2">
                  {previews[fieldName] && (
                    <img
                      src={previews[fieldName]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, fieldName)}
                    required={index === 0 && !isEditMode}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Checkboxes */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="rounded text-wood-600 focus:ring-wood-500"
              />
              <span className="ml-2 text-sm text-gray-700">Mashhur mahsulot</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="rounded text-wood-600 focus:ring-wood-500"
              />
              <span className="ml-2 text-sm text-gray-700">Faol</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-wood-600 text-white rounded-md hover:bg-wood-700"
            >
              {isEditMode ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
