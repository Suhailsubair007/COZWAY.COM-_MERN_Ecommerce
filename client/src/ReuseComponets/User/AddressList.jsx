import React from "react";
import AddressCard from "./AddressCard";

export default function AddressList({ addresses, onDelete, onEdit }) { 
  addresses.map((x)=>{
  })
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          {...address}
          onDelete={() => onDelete(address)}
          onEdit={() => onEdit(address)}
        />
      ))}
    </div>
  );
}
