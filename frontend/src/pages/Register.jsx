import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);

    if (result.success) {
      navigate('/');
    } else {
      setErrors(result.errors);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-2">
            Ro'yxatdan o'tish
          </h1>
          <p className="text-base text-gray-600 font-light">
            Yangi hisob yarating va maxsus takliflardan bahramand bo'ling
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 p-8 md:p-10">
          {errors.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm font-light">{errors.error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                  Ism
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                  placeholder="Ism"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1 font-light">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                  Familiya
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                  placeholder="Familiya"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1 font-light">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                Foydalanuvchi nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                placeholder="username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 font-light">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                  Parol <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-light">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-light text-gray-900 mb-2 tracking-wide uppercase">
                  Parolni tasdiqlang <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-light"
                  placeholder="••••••••"
                />
                {errors.password_confirm && (
                  <p className="text-red-500 text-xs mt-1 font-light">
                    {errors.password_confirm}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-none font-light tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'YUKLANMOQDA...' : "RO'YXATDAN O'TISH"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-light">yoki</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-light mb-4">
              Hisobingiz bormi?
            </p>
            <Link
              to="/login"
              className="inline-block w-full px-6 py-3 border border-gray-900 text-gray-900 rounded-none font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
            >
              KIRISH
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
          >
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
