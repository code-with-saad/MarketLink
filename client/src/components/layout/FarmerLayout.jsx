import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import Layout from '@/components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faClipboardList,
  faBoxes,
  faStore,
  faStar,
  faBell,
  faExclamationTriangle,
  faCheckCircle,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

const FarmerSidebar = () => {
  const user = useSelector(selectCurrentUser);
  const isPending = user?.status === 'pending';

  const navItems = [
    { label: 'Dashboard & Insights', path: '/farmer/dashboard', icon: faTachometerAlt },
    { label: 'Pre-orders', path: '/farmer/orders', icon: faClipboardList },
    { label: 'Weekly Stock', path: '/farmer/stock', icon: faBoxes },
    { label: 'Markets & Pickup', path: '/farmer/markets', icon: faStore },
    { label: 'Reviews', path: '/farmer/reviews', icon: faStar },
    { label: 'Stall Profile', path: '/farmer/profile', icon: faStore },
    { label: 'Notifications', path: '/farmer/notifications', icon: faBell },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="bg-warm-surface border border-earth-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-earth-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-forest-900 text-accent-lime flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">{user?.name || 'Farmer'}</span>
            <span className="text-xs text-earth-500 truncate">{user?.stall_name || user?.email}</span>
          </div>
        </div>

        {/* Approval status indicator badge */}
        <div className="pt-1">
          {isPending ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <FontAwesomeIcon icon={faHourglassHalf} className="animate-spin text-amber-600" />
              <span>Awaiting Admin Approval</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
              <span>Approved Stall Verified</span>
            </div>
          )}
        </div>

        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-forest-900 text-accent-lime shadow-sm'
                    : 'text-earth-700 hover:bg-warm-cream hover:text-foreground'
                }`
              }
            >
              <FontAwesomeIcon icon={item.icon} className="text-sm w-4 text-center" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const FarmerLayout = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isPending = user?.status === 'pending';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Global Pending Approval Banner */}
        {isPending && (
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 text-amber-900">
            <div className="w-12 h-12 rounded-2xl bg-amber-200/60 flex items-center justify-center shrink-0 text-amber-800 text-xl">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-serif text-base font-bold text-amber-950">
                Stall Account Pending Administrative Approval
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Your farmer stall profile is currently under review by MarketLink administrators. While your account is pending, you can complete your stall profile information, but inventory listing and marketplace features remain locked until approved.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <FarmerSidebar />
          <main className="flex-1 min-w-0 space-y-6">{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerLayout;
