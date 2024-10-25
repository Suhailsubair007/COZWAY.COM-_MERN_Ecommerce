import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ProfileUpdate() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.user.userInfo.id);
  // console.log("oooiiii",user)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/user/${user}`);
        console.log(response.data.user);
        // console.log(data)
        setFormData({
          fullname: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
        });
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        `/users/profile/${user}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-center w-[100%] h-[100%]">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-normal text-gray-800">
              Good Evening ! {formData.fullname}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-10">
              <Button
                variant="ghost"
                size="icon"
                className="ml-[500px]"
                onClick={handleEditClick}
                type="button"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <div className="flex justify-between items-start">
                <div className="w-[90%] space-y-2">
                  <Label
                    htmlFor="fullname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full bg-blue-50 border-rounded"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-[90%] bg-blue-50 border-none"
                  required
                  disabled // Email is always non-editable
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contactNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-[90%] bg-blue-50 border-none"
                  required
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <Button
                  type="submit"
                  className="py-4  w-[90%] bg-gray-700 text-white"
                >
                  Update Profile
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
