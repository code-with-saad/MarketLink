import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => (
  <div className="min-h-screen bg-warm-cream flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-forest-900 rounded-3xl flex items-center justify-center shadow-xl shadow-forest-900/20">
          <FontAwesomeIcon icon={faLeaf} className="text-accent-lime text-3xl" />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-8xl font-extrabold text-forest-900/10 font-serif select-none leading-none">404</p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 -mt-4">
          Page Not Found
        </h1>
        <p className="text-earth-700 text-sm sm:text-base leading-relaxed">
          The page you are looking for does not exist or may have been moved. Let us get you back to the harvest.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-accent-lime text-forest-950 font-bold text-sm rounded-xl hover:bg-accent-lime-hover transition-colors shadow-sm"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Go to Homepage</span>
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 border-2 border-forest-800 text-forest-900 font-semibold text-sm rounded-xl hover:bg-forest-900 hover:text-white transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  </div>
);

export default NotFound;
