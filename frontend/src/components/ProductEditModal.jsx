import { useState, useEffect } from 'react';

function ProductEditModal({ product, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    category: product.category || '',
    description: product.description || '',
    price: product.price || '',
    discount_percentage: product.discount_percentage || 0,
    uzum_link: product.uzum_link || '',
    yandex_market_link: product.yandex_market_link || '',
    is_featured: product.is_featured || false,
    is_active: product.is_active !== undefined ? product.is_active : true,
  });

  const [imageFiles, setImageFiles] = useState({
    image: null,
    image_2: null,
    image_3: null,
  });

  const [previews, setPreviews] = useState({
    image: product.image || null,
    image_2: product.image_2 || null,
    image_3: product.image_3 || null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    const submitData = new FormData();

    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add image files if they were changed
    Object.keys(imageFiles).forEach(key => {
      if (imageFiles[key]) {
        submitData.append(key, imageFiles[key]);
      }
    });

    onSave(product.id, submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-wood-900">Mahsulotni tahrirlash</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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
              Tavsif
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
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
                Chegirma (%) *
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
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uzum link *
            </label>
            <input
              type="url"
              name="uzum_link"
              value={formData.uzum_link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yandex Market link
            </label>
            <input
              type="url"
              name="yandex_market_link"
              value={formData.yandex_market_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-3 gap-4">
            {['image', 'image_2', 'image_3'].map((fieldName, index) => (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasm {index + 1} {index === 0 ? '*' : ''}
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
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductEditModal;
