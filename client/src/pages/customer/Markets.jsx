import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

const Markets = () => (
  <Layout>
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faStore} />
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Farmers Markets</h1>
          <p className="text-xs sm:text-sm text-earth-700">Find local market locations, operating days, and stalls.</p>
        </div>
      </div>

      <Card className="p-8 text-center bg-warm-surface border-dashed border-earth-300">
        <p className="text-sm font-medium text-earth-700">Markets directory and map views will appear here in upcoming phases.</p>
      </Card>
    </div>
  </Layout>
);

export default Markets;

