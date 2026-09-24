import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PrivacyPolicyContent } from '@/components/LegalContent';

const PrivacyPolicy = () => (
  <Layout>
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faShieldAlt} />
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-xs text-earth-500 mt-0.5">Last updated: September 2026</p>
        </div>
      </div>

      <PrivacyPolicyContent />

      <div className="pt-4 border-t border-earth-100">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  </Layout>
);

export default PrivacyPolicy;
