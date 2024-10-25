import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import axiosInstance from "@/config/axiosConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EditAddressModal({
  isOpen,
  onClose,
  addressId,
  onUpdate,
}) {
  const user = useSelector((state) => state.user.userInfo.id);
  const [address, setAddress] = useState({
    _id: "",
    name: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    city: "",
    pincode: "",
    alternatePhone: "",
    landmark: "",
    user: user,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (isOpen && addressId) {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(
            `/users/address/${addressId}`
          );
          console.log("Selected Address data:", response.data.address);
          setAddress({ ...response.data.address, user });
        } catch (error) {
          console.error("Error fetching address:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAddress();
  }, [addressId, isOpen, user]);

  console.log("address id : ",addressId);
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.patch(
        `/users/addresses/${addressId}`,
        address
      );
      console.log("Address updated successfully:", response.data);
      onUpdate(response.data.address); // Pass updated address back to parent
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto"
        aria-describedby="edit-address-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-gray-800">
            Edit Address
          </DialogTitle>
        </DialogHeader>
        {/* Accessibility description for screen readers */}
        <p id="edit-address-description" className="sr-only">
          Update your address details such as name, phone, address, district,
          state, city, pincode, alternate phone, and landmark.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={address.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                type="tel"
                pattern="[0-9]+"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={address.address}
              onChange={handleChange}
              placeholder="Street Address"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={address.district}
                onChange={handleChange}
                placeholder="District"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                name="alternatePhone"
                value={address.alternatePhone}
                onChange={handleChange}
                placeholder="Alternate Phone Number"
                type="tel"
                pattern="[0-9]+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                name="landmark"
                value={address.landmark}
                onChange={handleChange}
                placeholder="Nearby Landmark"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
