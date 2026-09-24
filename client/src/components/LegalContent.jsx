export const PrivacyPolicyContent = () => (
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
);

export const TermsOfServiceContent = () => (
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
);
