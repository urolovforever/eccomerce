import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-bold text-wood-600">404</h1>
      <p className="text-2xl mb-8">Sahifa topilmadi</p>
      <Link to="/" className="bg-wood-600 text-white px-8 py-3 rounded-lg hover:bg-wood-700">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}

export default NotFound;
