import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TermsOfService = () => (
  <Layout>
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faFileContract} />
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-xs text-earth-500 mt-0.5">Last updated: September 2026</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-earth-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using MarketLink ("the Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use the Platform.
          </p>
          <p>
            These Terms apply to all visitors, registered users, farmers, and market organizers who access or use the MarketLink platform in any capacity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">2. Eligibility and Account Registration</h2>
          <p>
            You must be at least 18 years of age to create an account on MarketLink. By registering, you represent and warrant that the information you provide is accurate, current, and complete. You are responsible for maintaining the confidentiality of your login credentials.
          </p>
          <p>
            Farmer accounts are subject to administrative review and approval before full platform access is granted. MarketLink reserves the right to reject or suspend any account at its discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">3. Platform Use and Conduct</h2>
          <p>You agree to use the Platform only for lawful purposes and in accordance with these Terms. You must not:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Post false, misleading, or deceptive product listings.</li>
            <li>Harass, threaten, or abuse other users on the platform.</li>
            <li>Attempt to circumvent any security measures or access controls.</li>
            <li>Use automated bots or scrapers without our prior written consent.</li>
            <li>Engage in any activity that interferes with or disrupts the Platform's infrastructure.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">4. Farmer Responsibilities</h2>
          <p>
            Farmers who list products on MarketLink are solely responsible for the accuracy of their listings, including price, availability, quantity, and product descriptions. Farmers must honor confirmed pre-orders up to the specified cutoff time. Failure to fulfill confirmed orders may result in account suspension.
          </p>
          <p>
            MarketLink does not guarantee market participation slots and does not act as a party to any transaction between farmers and customers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">5. Orders and Cancellations</h2>
          <p>
            Pre-orders placed through MarketLink represent a confirmed reservation between the customer and the farmer. Customers may cancel orders before the farmer's stated cutoff time. Orders cancelled after the cutoff time are subject to the individual farmer's cancellation policy.
          </p>
          <p>
            MarketLink is not responsible for disputes arising from product quality, availability, or fulfillment between farmers and customers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">6. Intellectual Property</h2>
          <p>
            All content, branding, and software on the MarketLink Platform, excluding user-submitted content, is owned by or licensed to MarketLink and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">7. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided "as is" and "as available" without warranties of any kind, express or implied. MarketLink does not warrant that the Platform will be uninterrupted, error-free, or free of harmful components. Your use of the Platform is at your own risk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, MarketLink shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including loss of profits, data, or business opportunities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">9. Modifications to Terms</h2>
          <p>
            MarketLink reserves the right to modify these Terms at any time. We will notify users of material changes via email or a prominent notice on the Platform. Continued use of the Platform following notice of changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-foreground">10. Contact</h2>
          <p>
            For questions about these Terms, please contact: support@marketlink.local
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

export default TermsOfService;
