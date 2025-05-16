
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { portfolioAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface PortfolioItem {
  fund_name: string;
  units: number;
  nav?: number;
  current_value?: number;
}

const Portfolio: React.FC = () => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const data = await portfolioAPI.getPortfolio(token);
        
        // Process portfolio data
        // This is a placeholder - actual structure depends on API response
        const portfolioItems: PortfolioItem[] = data.items || [];
        
        setPortfolio(portfolioItems);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // Toast is already handled in the API service
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  const getTotalValue = () => {
    return portfolio.reduce((total, item) => total + (item.current_value || 0), 0);
  };

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Your Portfolio</h1>
          <Button onClick={() => navigate("/portfolio/add")}>
            Add Fund
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : portfolio.length > 0 ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{getTotalValue().toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total portfolio value across {portfolio.length} funds
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {portfolio.map((item, index) => (
                <Card key={index} className="portfolio-card">
                  <div className="flex flex-col sm:flex-row justify-between p-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {item.fund_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.units.toFixed(4)} units
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <div className="font-semibold">
                        ₹{item.current_value?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NAV: ₹{item.nav?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No funds in your portfolio</h3>
            <p className="mt-2 text-muted-foreground">
              Start by adding some funds to your portfolio.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={() => navigate("/funds")}>Browse Funds</Button>
              <Button variant="outline" onClick={() => navigate("/portfolio/add")}>
                Add Manually
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Portfolio;
