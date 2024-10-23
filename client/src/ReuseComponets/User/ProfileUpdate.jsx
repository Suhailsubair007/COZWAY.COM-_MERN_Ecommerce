import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit } from "lucide-react";

export default function ProfileUpdate({ username = "Suhail" }) {
  const [formData, setFormData] = useState({
    fullname: "Suhail Subair",
    lastName: "Subair",
    email: "clashesuhail221@gmail.com",
    contactNumber: "+917736417357",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "Male",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-normal text-gray-800">
            Good Evening! {username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-[90%] space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full bg-blue-50 border-none"
                  required
                />
              </div>
              <Button variant="ghost" size="icon" className="mt-6">
                <Edit className="h-4 w-4" />
              </Button>
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
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-[90%] bg-blue-50 border-none"
                required
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
