
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fundsAPI, FundSchema } from "../services/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fundHouses = [
  "HDFC", "ICICI", "SBI", "Axis", "Kotak", 
  "Aditya Birla", "DSP", "Franklin", "IDFC", "UTI"
];

const Funds: React.FC = () => {
  const [selectedFundHouse, setSelectedFundHouse] = useState("HDFC");
  const [funds, setFunds] = useState<FundSchema[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunds = async () => {
      if (!selectedFundHouse) return;
      
      setIsLoading(true);
      try {
        const response = await fundsAPI.getSchemes(selectedFundHouse, page);
        setFunds(response);
      } catch (error) {
        console.error("Error fetching funds:", error);
        // Toast is already handled in the API service
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, [selectedFundHouse, page]);

  const filteredFunds = funds.filter(fund =>
    fund.scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToPortfolio = (fund: FundSchema) => {
    navigate("/portfolio/add", { state: { fundName: fund.scheme_name } });
  };

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Mutual Funds</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search funds..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {fundHouses.map((house) => (
            <Button
              key={house}
              variant={selectedFundHouse === house ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedFundHouse(house);
                setPage(1);
              }}
            >
              {house}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredFunds.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFunds.map((fund, index) => (
              <Card key={index} className="portfolio-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {fund.scheme_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fund House:</span>
                    <span className="font-medium">{fund.fund_house}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NAV:</span>
                    <span className="font-medium">₹{fund.nav.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToPortfolio(fund)}
                  >
                    Add to Portfolio
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No funds found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm ? "Try a different search term." : "No funds available for this fund house."}
            </p>
          </div>
        )}

        {!isLoading && funds.length > 0 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Funds;
