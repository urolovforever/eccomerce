import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();

  const isActive = (path) => location.pathname === path;
  const cartCount = getCartCount();

  const navLinks = [
    { path: '/products?new=true', label: 'Yangiliklar' },
    { path: '/products?sale=true', label: 'Chegirmadagilar' },
    { path: '/about', label: 'Biz haqimizda' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-light tracking-wider text-gray-900">MoonGift</span>
          </Link>

          {/* Center Navigation - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-bold transition-colors ${
                  isActive(link.path)
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Icon */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
              aria-label="Wishlist"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* User Icon/Menu */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="User menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {user?.username}
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Buyurtmalarim
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
                aria-label="Login"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Shopping cart"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-light" style={{ fontSize: '10px' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-light hidden md:block"
              aria-label="Language"
            >
              UZ
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-100">
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 text-base font-bold transition-colors ${
                  isActive(link.path)
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Buyurtmalarim
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Chiqish ({user?.username})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Kirish
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
