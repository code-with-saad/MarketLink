import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faArrowLeft, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

const ComingSoon = () => (
  <Layout>
    <div className="max-w-xl mx-auto text-center space-y-8 py-12">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-forest-900 rounded-3xl flex items-center justify-center shadow-xl shadow-forest-900/20">
            <FontAwesomeIcon icon={faLeaf} className="text-accent-lime text-3xl" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-lime rounded-xl flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faHourglassHalf} className="text-forest-950 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-forest-950">Coming Soon</h1>
        <p className="text-earth-700 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          This feature is being cultivated and will be ready for harvest in an upcoming release. Check back soon.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 h-11 px-6 bg-forest-900 text-white font-semibold text-sm rounded-xl hover:bg-forest-800 transition-colors shadow-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back to Home</span>
      </Link>
    </div>
  </Layout>
);

export default ComingSoon;
