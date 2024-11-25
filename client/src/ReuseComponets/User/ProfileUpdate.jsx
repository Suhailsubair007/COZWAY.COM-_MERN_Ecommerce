import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, User, Mail, Phone, Check } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .required("Phone number is required"),
});

export default function ProfileUpdate() {
  const user = useSelector((state) => state.user.userInfo.id);
  const [initialUserData, setInitialUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/user/${user}`);
        const userData = {
          fullname: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
        };
        setInitialUserData(userData);
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        <Formik
          enableReinitialize
          initialValues={initialUserData}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axiosInstance.patch(
                `/users/profile/${user}`,
                values
              );
              if (response.status === 200) {
                toast.success("Profile updated successfully");
              } else {
                toast.error("Error updating profile");
              }
            } catch (error) {
              toast.error("Error submitting form");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, values, isValid }) => (
            <Form className="space-y-6 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Profile
                </h1>
                <p className="text-gray-600 mt-2">
                  Good Evening, {values.fullname}!
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Label
                    htmlFor="fullname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Field
                    as={Input}
                    id="fullname"
                    name="fullname"
                    className="pl-10 w-full bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    placeholder="John Doe"
                  />
                  <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                  {errors.fullname && touched.fullname && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.fullname}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10 w-full bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    placeholder="john@example.com"
                    disabled
                  />
                  <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contact Number
                  </Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    type="tel"
                    className="pl-10 w-full bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    placeholder="1234567890"
                  />
                  <Phone className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center space-x-2 border-black text-black hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
                  disabled={isSubmitting || !isValid}
                >
                  <Check className="h-4 w-4" />
                  <span>{isSubmitting ? "Updating..." : "Update Profile"}</span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
