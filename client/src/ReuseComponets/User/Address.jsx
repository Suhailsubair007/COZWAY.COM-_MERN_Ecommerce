import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/config/axiosConfig";
import AddressList from "./AddressList";
import EditAddressModal from "./EditAddressModal";
import {toast} from 'sonner';
import AddAddressModal from "./AddNewAddress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null); // State to track address to delete

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

  const handleDelete = (address) => {
    setAddressToDelete(address);
    setIsCancelDialogOpen(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      await axiosInstance.delete(`/users/address/${addressToDelete._id}`);
      setAddresses(
        addresses.filter((addr) => addr._id !== addressToDelete._id)
      );
      toast.success('Address deleted sucessfully...')
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsCancelDialogOpen(false);
      setAddressToDelete(null);
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

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the address?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this address will permanently remove it from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
              No, keep the address
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Yes, delete the address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
