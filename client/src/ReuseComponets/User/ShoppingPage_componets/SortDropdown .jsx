import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SortDropdown = ({ sortBy, onSortChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onSortChange("newest")}>
        Newest
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSortChange("price_asc")}>
        Price: Low to High
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSortChange("price_desc")}>
        Price: High to Low
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSortChange("a_z")}>
        Aa-Zz
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSortChange("z_a")}>
        Zz-Aa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
