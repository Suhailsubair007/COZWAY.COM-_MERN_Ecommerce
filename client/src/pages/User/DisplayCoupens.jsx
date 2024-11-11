import { useEffect, useState } from "react";
import {
  Copy,
  CheckCircle,
  Percent,
  DollarSign,
  Calendar,
  ShoppingBag,
  Gift,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/config/axiosConfig";

const iconMap = {
  gift: Gift,
  zap: Zap,
  sparkles: Sparkles,
};

export default function DisplayCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/users/coupons");
      console.log("response---------->", response.data.coupens);
      setCoupons(response.data.coupens);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Failed to load coupons. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading coupons...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 top-5 p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Exclusive Offers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => {
          const IconComponent = iconMap[coupon.icon] || Gift;
          return (
            <Card
              key={coupon.id || coupon._id}
              className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 pb-8">
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      coupon.discount_type === "percentage"
                        ? "default"
                        : "secondary"
                    }
                    className="text-lg font-semibold px-3 py-1"
                  >
                    {coupon.discount_type === "percentage" ? (
                      <Percent className="w-5 h-5 mr-1 inline" />
                    ) : (
                      <DollarSign className="w-5 h-5 mr-1 inline" />
                    )}
                    {coupon.discount_value}
                    {coupon.discount_type === "percentage" ? "%" : " OFF"}
                  </Badge>
                </div>
                <div className={`text-${coupon.color || 'blue'}-500 mb-4`}>
                  <IconComponent className="w-12 h-12" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  {coupon.code}
                </CardTitle>
                <CardDescription className="text-sm">
                  {coupon.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <ShoppingBag className="w-5 h-5 mr-3 text-green-500" />
                    Min. Purchase: ${coupon.min_purchase_amount}
                  </div>
                  {coupon.max_discount_amount && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-3 text-red-500" />
                      Max. Discount: ${coupon.max_discount_amount}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    Expires: {formatDate(coupon.expiration_date)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50">
                <Button
                  className="w-full text-lg py-6 transition-all duration-300"
                  onClick={() => copyToClipboard(coupon.code)}
                  variant={copiedCode === coupon.code ? "secondary" : "default"}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}