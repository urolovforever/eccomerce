import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Column */}
          <div>
            <h3 className="text-sm font-light tracking-wider uppercase text-gray-900 mb-6">
              Biz haqimizda
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light mb-4">
              Zamonaviy ayollar kiyimlari va aksessuarlari. Yuqori sifat va zamonaviy dizayn.
            </p>
            <Link to="/about" className="text-sm text-gray-900 underline hover:text-gray-600 transition-colors font-light">
              Batafsil
            </Link>
          </div>

          {/* Customer Support Column */}
          <div>
            <h3 className="text-sm font-light tracking-wider uppercase text-gray-900 mb-6">
              Yordam
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Aloqa
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Mahsulotlar
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Buyurtmalar
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Yetkazib berish
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Qaytarish
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 className="text-sm font-light tracking-wider uppercase text-gray-900 mb-6">
              Ijtimoiy tarmoqlar
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/moongift.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/moongift_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-light tracking-wider uppercase text-gray-900 mb-6">
              Aloqa
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 font-light">
              <li>
                <a href="tel:+998917376667" className="hover:text-gray-900 transition-colors">
                  +998 91 737 66 67
                </a>
              </li>
              <li>
                Toshkent, O'zbekiston
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-gray-600 font-light mb-3">
                Yangiliklar va chegirmalardan xabardor bo'ling
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-3 py-2 border border-gray-300 text-sm font-light focus:outline-none focus:border-gray-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-light">
              &copy; 2025 MoonGift. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-light">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-light">
                Foydalanish shartlari
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
