import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBanner from "./AnnouncementBanner";

const Layout = ({ children, showBanner = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-warm-cream text-forest-950 font-sans selection:bg-accent-lime selection:text-forest-950">
      {/* Top Banner */}
      {showBanner && <AnnouncementBanner />}

      {/* Main Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
