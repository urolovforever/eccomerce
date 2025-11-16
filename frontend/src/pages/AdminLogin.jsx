import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(username, password);

      if (response.data.user) {
        // Login muvaffaqiyatli
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-100 to-wood-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-wood-900">
            🌙 MoonGift Admin
          </h2>
          <p className="mt-2 text-center text-sm text-wood-600">
            Admin panelga kirish
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-wood-500 focus:border-wood-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Parol
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-wood-500 focus:border-wood-500 focus:z-10 sm:text-sm"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wood-600 hover:bg-wood-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
