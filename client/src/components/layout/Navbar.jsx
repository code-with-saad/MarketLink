import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectCurrentUser, 
  selectIsAuthenticated, 
  logout 
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faSearch,
  faBell,
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
  faStore,
  faShoppingBag,
  faMapMarkedAlt,
  faUsers,
  faInfoCircle,
  faEnvelope,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "farmer") return "/farmer/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/customer/dashboard";
  };

  const navLinks = [
    { name: "Shop", path: "/customer/products", icon: faShoppingBag },
    { name: "Markets", path: "/customer/markets", icon: faStore },
    { name: "Farmers", path: "/customer/markets", icon: faUsers },
    { name: "Map", path: "/customer/markets", icon: faMapMarkedAlt },
    { name: "About", path: "/about", icon: faInfoCircle },
    { name: "Contact", path: "/contact", icon: faEnvelope },
  ];

  return (
    <header className="sticky top-0 z-50 bg-forest-900 border-b border-forest-800 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 bg-accent-lime text-forest-950 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-lime/20 group-hover:scale-105 transition-transform duration-200">
              <FontAwesomeIcon icon={faLeaf} className="text-xl text-forest-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-accent-lime transition-colors">
                MarketLink
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-lime/80 -mt-1">
                eGreen Basket
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? "bg-forest-800 text-accent-lime font-semibold"
                      : "text-warm-cream/80 hover:text-white hover:bg-forest-800/60"
                  }`
                }
              >
                <FontAwesomeIcon icon={link.icon} className="text-xs text-accent-lime/70" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stalls, fresh veggies..."
                    autoFocus
                    className="w-56 h-9 pl-3 pr-8 bg-forest-800 border border-forest-700 text-white placeholder:text-warm-cream/50 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-lime"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 text-warm-cream/60 hover:text-white text-xs"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-warm-cream hover:text-accent-lime flex items-center justify-center transition-colors cursor-pointer"
                  title="Search MarketLink"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-warm-cream hover:text-accent-lime flex items-center justify-center transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-lime rounded-full ring-2 ring-forest-900 animate-pulse"></span>
            </button>

            {/* Auth / User Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-left transition-all border border-forest-700/60 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-lime text-forest-950 flex items-center justify-center font-bold text-xs shadow-inner">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-accent-lime uppercase font-bold tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-warm-surface text-forest-950 rounded-2xl shadow-xl border border-earth-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-earth-100">
                      <p className="text-xs font-bold text-forest-950">{user.name}</p>
                      <p className="text-[11px] text-earth-500 truncate">{user.email}</p>
                      {user.stall_name && (
                        <p className="text-[11px] text-forest-700 font-medium mt-0.5">
                          Stall: {user.stall_name}
                        </p>
                      )}
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-warm-cream transition-colors"
                    >
                      <FontAwesomeIcon icon={faTachometerAlt} className="text-forest-700" />
                      <span>{user.role?.toUpperCase()} Dashboard</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:text-accent-lime hover:bg-forest-800">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Join MarketLink
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-forest-800 text-warm-cream hover:text-accent-lime focus:outline-none cursor-pointer"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-950 border-t border-forest-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm fresh items..."
              className="w-full h-10 pl-9 pr-4 bg-forest-900 border border-forest-800 text-white placeholder:text-warm-cream/50 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-lime"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-warm-cream/50 text-sm" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-forest-800 text-accent-lime font-bold"
                      : "text-warm-cream/90 hover:bg-forest-900"
                  }`
                }
              >
                <FontAwesomeIcon icon={link.icon} className="text-accent-lime w-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-forest-800/80">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2 bg-forest-900 rounded-xl">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-accent-lime uppercase font-semibold">{user.role}</p>
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 px-4 rounded-xl bg-accent-lime text-forest-950 font-bold text-sm shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-center py-2 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-red-400 font-semibold text-sm cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-forest-900 text-white font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-accent-lime text-forest-950 font-bold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
