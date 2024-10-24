import React, { useState } from "react";
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

function AddAddressModal({ isOpen, onClose, onAdd }) {
  const user = useSelector((state) => state.user.userInfo.id);
  console.log(user);

  const [address, setAddress] = useState({
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

  console.log(address);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/users/addresses", address);

      console.log("Address added successfully:", response.data);

      onAdd(response.data);

      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-gray-800">
            Add New Address
          </DialogTitle>
        </DialogHeader>
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
                type="tel" // restrict input to numeric
                pattern="[0-9]+" // regex pattern to allow only digits
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
                type="tel" // restrict input to numeric
                pattern="[0-9]+" // regex pattern to allow only digits
                onChange={handleChange}
                placeholder="Alternate Phone Number"
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
            >
              Add Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddAddressModal;
