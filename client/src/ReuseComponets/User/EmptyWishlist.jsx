import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EmptyWishlist() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/shop");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Heart className="w-24 h-24 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        Looks like you haven&apos;t added any items to your wishlist yet.
        Explore our products and find something you love!
      </p>
      <Button onClick={handleExplore} className="px-6 py-2">
        Start Exploring
      </Button>
    </div>
  );
}
