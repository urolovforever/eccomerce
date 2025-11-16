import { useState } from 'react';
import { sendContactMessage } from '../api/api';

function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-light py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-text-primary mb-4">Bog'lanish</h1>
          <p className="text-xl text-text-secondary">Biz bilan bog'laning va savollaringizga javob oling</p>
        </div>
        <div className="bg-white rounded-button shadow-soft-lg p-10 border-t-4 border-accent">
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-5 rounded-button mb-6 font-semibold text-center">
              ✓ Xabar muvaffaqiyatli yuborildi!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-text-primary font-semibold mb-2">Ismingiz</label>
              <input
                type="text"
                placeholder="Ismingizni kiriting"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-3 border-2 border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-primary"
              />
            </div>
            <div className="mb-6">
              <label className="block text-text-primary font-semibold mb-2">Telefon raqamingiz</label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-3 border-2 border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-primary"
              />
            </div>
            <div className="mb-6">
              <label className="block text-text-primary font-semibold mb-2">Xabaringiz</label>
              <textarea
                placeholder="Xabaringizni yozing..."
                required
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-5 py-3 border-2 border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-primary resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-button hover:bg-primary-700 transition-colors font-semibold text-lg shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yuborilmoqda...' : 'Xabar yuborish'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-border-light">
            <h3 className="text-lg font-bold text-text-primary mb-4 text-center">Ijtimoiy tarmoqlarda ham bog'laning</h3>
            <div className="flex gap-4 justify-center">
              <a href="https://instagram.com/moongift.uz/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-700 text-white rounded-lg transition-colors shadow-soft font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href="https://t.me/moongiftuz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors shadow-soft font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
