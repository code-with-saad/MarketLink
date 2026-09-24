import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { getProducts } from "@/api/customerApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLeaf, 
  faStore, 
  faShoppingBasket, 
  faClock, 
  faMapMarkerAlt, 
  faArrowRight, 
  faStar, 
  faShieldAlt,
  faSeedling,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const res = await getProducts();
        if (isMounted && res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else if (isMounted && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        // Endpoint may not have data or may return 501 in early phases
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/customer/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-forest-900 text-white p-8 sm:p-14 shadow-xl border border-forest-800">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800 border border-forest-700 text-accent-lime text-xs font-bold tracking-wide uppercase">
              <FontAwesomeIcon icon={faLeaf} />
              <span>Direct From Local Farmers</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              Reserve fresh harvest before it sells out at the market.
            </h1>

            <p className="text-warm-cream/80 text-base sm:text-lg leading-relaxed">
              Discover verified local producers, pre-order handcrafted goods, and pick up your items directly at your community farmers market stall.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-lg">
              <SearchInput 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Search carrots, artisan cheese, honey..."
                className="shadow-lg"
              />
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/customer/products">
                <Button variant="primary" size="lg" className="shadow-lg shadow-accent-lime/20">
                  <span>Browse Fresh Goods</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Link>
              <Link to="/customer/markets">
                <Button variant="outline" size="lg" className="border-warm-cream/40 text-warm-cream hover:bg-forest-800 hover:text-white">
                  <FontAwesomeIcon icon={faStore} />
                  <span>Find Nearby Markets</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-earth-200/80 bg-warm-surface p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-accent-lime flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest-950">Guaranteed Pickup Slots</h3>
            <p className="text-sm text-earth-700 leading-relaxed">
              Never rush to empty market tables. Pre-ordered baskets are set aside under strict farmer cutoff times.
            </p>
          </Card>

          <Card className="border-earth-200/80 bg-warm-surface p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-accent-lime flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest-950">100% Local Growers</h3>
            <p className="text-sm text-earth-700 leading-relaxed">
              Every profile is verified with transparent farm profiles, stalls, operating days, and genuine reviews.
            </p>
          </Card>

          <Card className="border-earth-200/80 bg-warm-surface p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-accent-lime flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest-950">Direct Community Impact</h3>
            <p className="text-sm text-earth-700 leading-relaxed">
              Support local agriculture with transparent pricing and zero intermediaries between farm and basket.
            </p>
          </Card>
        </div>

        {/* Listings Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-earth-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Marketplace Showcase</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Featured Harvest Items</h2>
            </div>
            <Link to="/customer/products" className="text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1.5 group">
              <span>View full catalog</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-earth-700 flex flex-col items-center gap-3">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-forest-800" />
              <p className="text-sm font-medium">Loading fresh products from local stalls...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <Card key={item._id || item.id} className="overflow-hidden flex flex-col group">
                  <div className="relative h-48 bg-earth-100 overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-warm-cream-dark text-earth-500">
                        <FontAwesomeIcon icon={faLeaf} className="text-3xl text-forest-700/40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-forest-950/80 backdrop-blur-sm text-accent-lime text-xs font-bold rounded-lg shadow-sm">
                        {item.category || "Produce"}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg group-hover:text-forest-800 transition-colors">
                      {item.name}
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="text-xs text-earth-500 line-clamp-2 pt-1">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardFooter className="p-5 pt-3 border-t border-earth-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="font-serif text-xl font-extrabold text-forest-950">${item.price}</span>
                      {item.unit && <span className="text-xs text-earth-500 ml-1">/ {item.unit}</span>}
                    </div>
                    <Link to={`/customer/products`}>
                      <Button variant="primary" size="sm" className="shadow-sm">
                        <FontAwesomeIcon icon={faShoppingBasket} />
                        <span>Order</span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-warm-surface border-dashed border-earth-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-warm-cream-dark text-forest-800 flex items-center justify-center text-xl mx-auto">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">New listings coming soon</h3>
              <p className="text-xs sm:text-sm text-earth-700 max-w-md mx-auto">
                Local farmers are currently updating their harvest availability and pickup schedules. Check back soon for fresh arrivals.
              </p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
