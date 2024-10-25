import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import axiosInstance from "@/config/axiosConfig"; // Assuming axios is configured
import EditAddressModal from "./EditAddressModal";
import AddAddressModal from "./AddNewAddress";
import { useSelector } from "react-redux";

const AddressCard = ({
  _id,
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

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);


  const user = useSelector((state) => state.user.userInfo.id);
  console.log("User Id by redux:", user);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get(`/users/addresses/${user}`);
        console.log("Existing addresses:",response.data.addresses);
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);



  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  

  const handleDelete = async (addressToDelete) => {
    try {
      await axiosInstance.delete(`/users/address/${addressToDelete._id}`);
      setAddresses(
        addresses.filter((addr) => addr._id !== addressToDelete._id)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };



  const handleSaveEdit = (updatedAddress) => {
    setAddresses(
      addresses.map((addr) =>
        addr._id === updatedAddress._id ? updatedAddress : addr
      )
    );
    setIsEditModalOpen(false);
  };



  const handleAddAddress = (newAddress) => {
    const formattedNewAddress = {
      _id: newAddress._id,
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      pincode: newAddress.pincode,
    };
    setAddresses([...addresses, formattedNewAddress]);
    setIsAddModalOpen(false);
  };



  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl font-normal text-gray-800">
              Delivery Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
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

        <EditAddressModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          addressId={editingAddress ? editingAddress._id : null}
          onUpdate={handleSaveEdit}
        />

        <AddAddressModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAddress}
        />
      </div>
    </>
  );
}

export default Address;
