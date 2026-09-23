import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SearchInput } from "@/components/ui/search-input";
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
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const sampleProducts = [
    {
      id: "1",
      name: "Crisp Heirloom Carrots",
      category: "Vegetables",
      stall: "Sunny Meadows Organic Farm",
      market: "Greenfield Saturday Market",
      price: "$4.50",
      unit: "bunch",
      rating: 4.9,
      status: "completed",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Wildflower Raw Honey Jar",
      category: "Pantry",
      stall: "Valley Apiaries",
      market: "Highland Community Market",
      price: "$12.00",
      unit: "16 oz jar",
      rating: 5.0,
      status: "ready",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Fresh Farmstead Goat Cheese",
      category: "Dairy",
      stall: "Oak Ridge Dairy Stalls",
      market: "Greenfield Saturday Market",
      price: "$8.25",
      unit: "wheel",
      rating: 4.8,
      status: "accepted",
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80",
    },
  ];

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
            <div className="pt-2 max-w-lg">
              <SearchInput 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Search carrots, artisan cheese, honey..."
                className="shadow-lg"
              />
            </div>

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

        {/* Sample Listings using Shared Components */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col group">
                {/* Image & Category Pill */}
                <div className="relative h-48 bg-earth-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-forest-950/80 backdrop-blur-sm text-accent-lime text-xs font-bold rounded-lg shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-earth-500 mb-1">
                    <FontAwesomeIcon icon={faStore} className="text-forest-700" />
                    <span className="truncate">{item.stall}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-forest-800 transition-colors">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs text-earth-500 pt-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-earth-400" />
                    <span>{item.market}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-2 flex-1">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{item.rating}</span>
                    <span className="text-earth-500 font-normal">(Verified buyer feedback)</span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-3 border-t border-earth-100 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-xl font-extrabold text-forest-950">{item.price}</span>
                    <span className="text-xs text-earth-500 ml-1">/ {item.unit}</span>
                  </div>
                  <Button variant="primary" size="sm" className="shadow-sm">
                    <FontAwesomeIcon icon={faShoppingBasket} />
                    <span>Pre-Order</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Status Demo Showcase */}
        <Card className="p-6 sm:p-8 bg-warm-surface border-earth-200">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-950">Design System Status Indicators</h3>
            <p className="text-sm text-earth-700">
              Clear visual statuses utilized across customer order tracking, farmer fulfillment, and admin oversight:
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <StatusBadge status="placed" label="Placed (Customer Action)" />
              <StatusBadge status="accepted" label="Accepted (Farmer Action)" />
              <StatusBadge status="ready" label="Ready for Pickup" />
              <StatusBadge status="completed" label="Completed" />
              <StatusBadge status="cancelled" label="Cancelled (Before Cutoff)" />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
