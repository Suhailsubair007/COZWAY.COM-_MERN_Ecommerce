import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export default function AddressCard({
  _id,
  name,
  phone,
  address,
  pincode,
  onDelete,
  onEdit,
}) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-gray-600">{phone}</div>
          <div className="text-sm text-gray-600">{address}</div>
          <div className="text-sm text-gray-600">{pincode}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}