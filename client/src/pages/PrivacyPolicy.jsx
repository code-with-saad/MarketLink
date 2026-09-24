import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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

      <div className="prose prose-sm max-w-none space-y-6 text-earth-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">1. Introduction</h2>
          <p>
            MarketLink ("we", "our", or "us") operates an online platform that connects local farmers, market organizers, and consumers. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p>
            By registering for or using MarketLink, you agree to the practices described in this policy. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">2. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Account registration data: name, email address, password (stored as a cryptographic hash), role (customer or farmer), and contact information.</li>
            <li>Farmer-specific data: stall name, market affiliations, operating days, and inventory listings.</li>
            <li>Customer-specific data: delivery address and order history.</li>
            <li>Communications: messages or support requests you send us.</li>
          </ul>
          <p>
            We also automatically collect certain usage data such as browser type, device identifiers, pages visited, and interaction timestamps for the purpose of improving platform performance and security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Operate, maintain, and improve the MarketLink platform.</li>
            <li>Process and fulfill orders and pickup reservations.</li>
            <li>Send transactional emails such as order confirmations and password reset codes.</li>
            <li>Verify farmer accounts and manage admin approvals.</li>
            <li>Detect and prevent fraud, abuse, or security incidents.</li>
            <li>Comply with applicable legal obligations.</li>
          </ul>
          <p>We do not sell, rent, or share your personal information with third parties for their own marketing purposes.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">4. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is active or as needed to provide services. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">5. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. Passwords are stored only as bcrypt hashes and are never recoverable in plain text. Authentication sessions are managed via short-lived JSON Web Tokens. Despite these measures, no system is completely secure, and we cannot guarantee the absolute security of your information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Access or download the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at support@marketlink.local.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the date at the top of this page and, where appropriate, notify users via email or a prominent notice on the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">8. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at: support@marketlink.local
          </p>
        </section>
      </div>

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
