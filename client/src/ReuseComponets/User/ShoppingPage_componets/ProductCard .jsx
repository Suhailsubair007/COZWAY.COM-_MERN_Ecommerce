import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ProductCard = ({ product, onNavigate }) => {

  return(
  <Card
    onClick={() => onNavigate(product)}
    className="bg-white overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50"
  >
    <div className="relative pb-[400px] overflow-hidden">
      <img
        src={product.images[0]}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <CardContent className="p-4 flex-grow">
      <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300 truncate">
        {product.name}
      </p>

      <p className="text-sm text-gray-500 truncate">{product.category.name}</p>
      {product.totalStock === 0 ? (
        <div className="flex pt-2 justify-end">
          <Badge variant="destructive" className="group-hover:animate-pulse">
            Out of stock!
          </Badge>
        </div>
      ) : (
        product.totalStock <= 5 && (
          <div className="flex pt-2 justify-end">
            <Badge variant="destructive" className="group-hover:animate-pulse">
              Only {product.totalStock} left!
            </Badge>
          </div>
        )
      )}

      <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors duration-300">
        ₹
        {product?.offer?.offer_value
          ?( product?.offerPrice -
            (product?.offerPrice * product?.offer?.offer_value) / 100)
          : product?.offerPrice}
      </p>
    </CardContent>
  </Card>
  )
};
