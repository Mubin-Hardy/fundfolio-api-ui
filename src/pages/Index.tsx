
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "../components/Layout";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px-56px)] flex-col items-center justify-center text-center">
        <div className="w-full max-w-4xl space-y-6 px-4 py-12 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-primary">FundFolio</span>: Your Personal Mutual Fund Portfolio Tracker
          </h1>
          
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Easily track your mutual fund investments, discover new schemes, and monitor your portfolio performance.
          </p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="w-full bg-secondary py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-8 text-2xl font-bold text-center">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Track Investments</h3>
                <p className="text-muted-foreground">
                  Keep track of all your mutual fund investments in one place with detailed analytics.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Discover Funds</h3>
                <p className="text-muted-foreground">
                  Browse and search through thousands of mutual fund schemes from various fund houses.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Portfolio Management</h3>
                <p className="text-muted-foreground">
                  Add funds to your portfolio and track your performance over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
