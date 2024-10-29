import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/config/axiosConfig";
import AddressList from "./AddressList";
import EditAddressModal from "./EditAddressModal";
import AddAddressModal from "./AddNewAddress";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const user = useSelector((state) => state.user.userInfo.id);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get(`/users/addresses/${user}`);
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (addressToDelete) => {
    try {
      await axiosInstance.delete(`/users/address/${addressToDelete._id}`);
      setAddresses(addresses.filter((addr) => addr._id !== addressToDelete._id));
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
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-normal text-gray-800">
            Delivery Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <AddressList
            addresses={addresses}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
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
  );
}