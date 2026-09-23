import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLeaf, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faHeart, 
  faSeedling,
  faShoppingBasket,
  faStore,
  faCalendarAlt,
  faShieldAlt
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-forest-950 text-warm-cream pt-16 pb-8 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800/80">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-lime text-forest-950 rounded-2xl flex items-center justify-center shadow-md shadow-accent-lime/10">
                <FontAwesomeIcon icon={faLeaf} className="text-lg text-forest-950" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                MarketLink
              </span>
            </div>
            <p className="text-warm-cream/80 text-sm leading-relaxed max-w-sm">
              Empowering local growers, market organizers, and conscious consumers through seamless community pre-ordering and farm-fresh pickup scheduling.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-accent-lime font-medium">
              <FontAwesomeIcon icon={faSeedling} />
              <span>Supporting Sustainable Family Farms Daily</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingBasket} className="text-xs text-accent-lime" />
              <span>Shop Fresh</span>
            </h4>
            <ul className="space-y-2 text-sm text-warm-cream/80">
              <li>
                <Link to="/customer/products" className="hover:text-accent-lime transition-colors">
                  All Harvest Products
                </Link>
              </li>
              <li>
                <Link to="/customer/markets" className="hover:text-accent-lime transition-colors">
                  Local Farmers Markets
                </Link>
              </li>
              <li>
                <Link to="/customer/products?category=vegetables" className="hover:text-accent-lime transition-colors">
                  Organic Vegetables
                </Link>
              </li>
              <li>
                <Link to="/customer/products?category=fruits" className="hover:text-accent-lime transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/customer/products?category=dairy" className="hover:text-accent-lime transition-colors">
                  Farm Dairy & Eggs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faStore} className="text-xs text-accent-lime" />
              <span>For Farmers</span>
            </h4>
            <ul className="space-y-2 text-sm text-warm-cream/80">
              <li>
                <Link to="/register" className="hover:text-accent-lime transition-colors">
                  Open a Farmer Stall
                </Link>
              </li>
              <li>
                <Link to="/farmer/dashboard" className="hover:text-accent-lime transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/farmer/stock" className="hover:text-accent-lime transition-colors">
                  Inventory & Stock
                </Link>
              </li>
              <li>
                <Link to="/farmer/orders" className="hover:text-accent-lime transition-colors">
                  Pickup Slot Controls
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent-lime transition-colors">
                  Farmer Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-xs text-accent-lime" />
              <span>Contact & Help</span>
            </h4>
            <ul className="space-y-2 text-sm text-warm-cream/80">
              <li className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faEnvelope} className="text-accent-lime text-xs shrink-0" />
                <span className="truncate">support@marketlink.local</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPhone} className="text-accent-lime text-xs shrink-0" />
                <span>+1 (800) 555-FARM</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent-lime text-xs shrink-0 mt-1" />
                <span>Greenfield Regional Farmers Network</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar + Map Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-cream/60">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} MarketLink Community Platform. Made for local agriculture.</span>
          </div>
          <div className="text-right">
            <span>Interactive map tiles provided by OpenStreetMap contributors.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
