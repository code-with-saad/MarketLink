import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

const CustomerOrders = () => (
  <Layout>
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faBoxOpen} />
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-xs sm:text-sm text-earth-700">Track current pre-orders, pickup windows, and order history.</p>
        </div>
      </div>

      <Card className="p-8 text-center bg-warm-surface border-dashed border-earth-300">
        <p className="text-sm font-medium text-earth-700">Your placed orders and pickup schedules will appear here in upcoming phases.</p>
      </Card>
    </div>
  </Layout>
);

export default CustomerOrders;

