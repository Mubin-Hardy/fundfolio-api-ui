
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { portfolioAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AddPortfolio: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fundName, setFundName] = useState("");
  const [units, setUnits] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate from navigation state if available
  useEffect(() => {
    if (location.state && location.state.fundName) {
      setFundName(location.state.fundName);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fundName.trim() || !units.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const unitsNumber = parseFloat(units);
    if (isNaN(unitsNumber) || unitsNumber <= 0) {
      toast.error("Please enter a valid number of units");
      return;
    }
    
    if (!token) {
      toast.error("You need to be logged in");
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await portfolioAPI.addToPortfolio(token, {
        fund_name: fundName,
        units: unitsNumber,
      });
      
      toast.success("Fund added to portfolio");
      navigate("/portfolio");
    } catch (error) {
      console.error("Error adding to portfolio:", error);
      // Toast is already handled in the API service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout requireAuth>
      <div className="max-w-lg mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Add to Portfolio</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Fund Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fundName">Fund Name</Label>
                <Input
                  id="fundName"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  placeholder="Enter the complete fund scheme name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input
                  id="units"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="Number of units"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/portfolio")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add to Portfolio"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPortfolio;
