import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import EditAddressModal from "./EditAddressModal"
import AddAddressModal from "./AddNewAddress"; 
const AddressCard = ({
  type,
  name,
  phone,
  address,
  pincode,
  onDelete,
  onEdit,
}) => (
  <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">{type}</span>
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
        <div className="text-sm text-gray-600">Pincode: {pincode}</div>
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

function AddNewAddress() {
  const [addresses, setAddresses] = useState([
    {
      type: "Primary",
      name: "John Doe",
      phone: "+91 98765 98265",
      address: "House 1, Main Street, Kerala",
      pincode: "689201",
    },
    {
      type: "Secondary",
      name: "Jane Doe",
      phone: "+91 98765 43210",
      address: "Apartment 2B, Park Avenue, Kerala",
      pincode: "689202",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDelete = (addressToDelete) => {
    setAddresses(addresses.filter((addr) => addr !== addressToDelete));
  };

  const handleSaveEdit = (editedAddress) => {
    setAddresses(
      addresses.map((addr) => (addr === editingAddress ? editedAddress : addr))
    );
    setIsEditModalOpen(false);
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  return (
    <>
    {/* <Header/> */}
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-normal text-gray-800">
            Delivery Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {addresses.map((address, index) => (
              <AddressCard
                key={index}
                {...address}
                onDelete={() => handleDelete(address)}
                onEdit={() => handleEdit(address)}
              />
            ))}
          </div>
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Address
          </Button>
        </CardContent>
      </Card>

      {editingAddress && (
        <EditAddressModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          address={editingAddress}
          onSave={handleSaveEdit}
        />
      )}

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAddress}
      />
    </div>
    </>
  );
}

export default AddNewAddress;
