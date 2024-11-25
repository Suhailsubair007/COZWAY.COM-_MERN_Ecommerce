import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function ChangePassword() {
  const email = useSelector((state) => state.user.userInfo.email);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation checks
    if (formData.new.length <= 6) {
      setMessage({ error: "New password must be more than 6 characters" });
      return;
    }

    if (formData.new !== formData.confirm) {
      setMessage({ error: "New passwords don't match" });
      return;
    }

    setLoading(true);
    setMessage({ error: "", success: "" });

    try {
      const response = await axiosInstance.post("/users/update_password", {
        email,
        currentPassword: formData.current,
        newPassword: formData.new,
      });

      const data = await response.data;
      if (response.status === 200) {
        setFormData({ current: "", new: "", confirm: "" });
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-extrabold text-center text-gray-900">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="current"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="current"
                name="current"
                type={showPassword.current ? "text" : "password"}
                value={formData.current}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="new"
                name="new"
                type={showPassword.new ? "text" : "password"}
                value={formData.new}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="confirm"
                name="confirm"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {message.error && (
            <p className="text-sm text-red-600" role="alert">
              {message.error}
            </p>
          )}
          {message.success && (
            <p className="text-sm text-green-600" role="alert">
              {message.success}
            </p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              disabled={loading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock
                  className="h-5 w-5 text-gray-300 group-hover:text-gray-200"
                  aria-hidden="true"
                />
              </span>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
