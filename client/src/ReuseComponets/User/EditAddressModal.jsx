import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/config/axiosConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {addressValidationSchema} from '../../utils/Validations'


export default function EditAddressModal({
  isOpen,
  onClose,
  addressId,
  onUpdate,
}) {
  const user = useSelector((state) => state.user.userInfo.id);
  const [initialValues, setInitialValues] = React.useState({
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

  useEffect(() => {
    const fetchAddress = async () => {
      if (isOpen && addressId) {
        try {
          const response = await axiosInstance.get(`/users/address/${addressId}`);
          setInitialValues({ ...response.data.address, user });
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };
    fetchAddress();
  }, [addressId, isOpen, user]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.patch(
        `/users/addresses/${addressId}`,
        values
      );
      onUpdate(response.data.address);
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setSubmitting(false);
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
        <p id="edit-address-description" className="sr-only">
          Update your address details such as name, phone, address, district,
          state, city, pincode, alternate phone, and landmark.
        </p>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={addressValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Full Name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    type="tel"
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Field
                  as={Input}
                  id="address"
                  name="address"
                  placeholder="Street Address"
                />
                {errors.address && touched.address && (
                  <div className="text-red-500 text-sm">{errors.address}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Field
                    as={Input}
                    id="district"
                    name="district"
                    placeholder="District"
                  />
                  {errors.district && touched.district && (
                    <div className="text-red-500 text-sm">{errors.district}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Field
                    as={Input}
                    id="state"
                    name="state"
                    placeholder="State"
                  />
                  {errors.state && touched.state && (
                    <div className="text-red-500 text-sm">{errors.state}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    placeholder="City"
                  />
                  {errors.city && touched.city && (
                    <div className="text-red-500 text-sm">{errors.city}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Field
                    as={Input}
                    id="pincode"
                    name="pincode"
                    placeholder="Pincode"
                  />
                  {errors.pincode && touched.pincode && (
                    <div className="text-red-500 text-sm">{errors.pincode}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Field
                    as={Input}
                    id="alternatePhone"
                    name="alternatePhone"
                    placeholder="Alternate Phone Number"
                    type="tel"
                  />
                  {errors.alternatePhone && touched.alternatePhone && (
                    <div className="text-red-500 text-sm">{errors.alternatePhone}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Field
                    as={Input}
                    id="landmark"
                    name="landmark"
                    placeholder="Nearby Landmark"
                  />
                  {errors.landmark && touched.landmark && (
                    <div className="text-red-500 text-sm">{errors.landmark}</div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Address"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}