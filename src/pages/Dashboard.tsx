
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { portfolioAPI } from "../services/api";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PortfolioSummary {
  totalValue: number;
  fundCount: number;
  topPerformer?: string;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    fundCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const portfolioData = await portfolioAPI.getPortfolio(token);
        
        // Process portfolio data to calculate summary
        // This is a simplified example - actual data structure may vary
        const summary: PortfolioSummary = {
          totalValue: portfolioData?.totalValue || 0,
          fundCount: portfolioData?.items?.length || 0,
          topPerformer: portfolioData?.topPerformer || undefined,
        };
        
        setPortfolioSummary(summary);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // Toast is already handled in the API service
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [token]);

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => navigate("/funds")}>Browse Funds</Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{portfolioSummary.totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your current portfolio value
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {portfolioSummary.fundCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Number of funds in your portfolio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {portfolioSummary.topPerformer || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your best performing fund
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {!isLoading && portfolioSummary.fundCount === 0 && (
          <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No funds in your portfolio</h3>
            <p className="mt-2 text-muted-foreground">
              Start by adding some funds to your portfolio.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/funds")}
            >
              Browse Funds
            </Button>
          </div>
        )}
        
        <div className="pt-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => navigate("/portfolio")}
            >
              <span className="text-lg font-medium">View Portfolio</span>
              <span className="text-sm text-muted-foreground">
                See your full portfolio details
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => navigate("/funds")}
            >
              <span className="text-lg font-medium">Find Funds</span>
              <span className="text-sm text-muted-foreground">
                Browse available mutual funds
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => navigate("/portfolio/add")}
            >
              <span className="text-lg font-medium">Add Investment</span>
              <span className="text-sm text-muted-foreground">
                Record a new fund investment
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
