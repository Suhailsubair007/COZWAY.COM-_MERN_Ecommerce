import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { OTPVerification } from "./OTPVerification";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { setUserDetails } from "../../../redux/UserSlice";
import { useDispatch } from "react-redux";
import {SignupValidation} from '../../../utils/Validations'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (values, { setSubmitting }) => {
    const { name, email, phone, password } = values;

    const signUpData = {
      name,
      email,
      phone,
      password,
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/send-otp", signUpData);
      console.log(response.data);

      if (response.status === 200) {
        setIsOTPDialogOpen(true);
        toast("OTP sent to your email.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast("Email ID already exists!");
      } else {
        console.error("Error sending OTP:", error);
        toast("Error sending OTP. Please try again later.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleOTPVerify = async (otp, values) => {
    const { name, email, phone, password } = values;
    const signUpWithOtpData = {
      name,
      email,
      phone,
      password,
      otp,
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/users/signup",
        signUpWithOtpData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (response.status === 201) {
        navigate("/login");
        toast("Signup successful! Please log in.");
      } else {
        alert("Invalid OTP or failed to signup.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (values) => {
    const { name, email, phone, password } = values;

    const signUpData = {
      name,
      email,
      phone,
      password,
    };

    console.log(signUpData);
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/send-otp", signUpData, {
        withCredentials: true,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast("OTP resent to your email.");
      } else {
        alert("Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast("Error resending OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigate = () => {
    navigate("/login");
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const credentialResponseData = jwtDecode(credentialResponse.credential);
    console.log(credentialResponseData);

    try {
      const response = await axiosInstance.post(
        "/users/auth/google-signup",
        credentialResponseData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.user);
      
      dispatch(setUserDetails(response.data.user));
      toast("Google Signup successful!");
      navigate("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast("Error signing in with Google. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">cozway.com</h1>
          <h2 className="text-3xl font-bold mt-6 mb-6">Sign up</h2>
        </div>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupValidation}
          onSubmit={handleSignUp}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Full name"
                  required
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Mobile Number</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Mobile Number"
                  onKeyPress={(e) => {
                    // Allow only digits
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-sm text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLoginNavigate}
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Sending OTP..." : "Sign Up"}
              </Button>

              <OTPVerification
                isOpen={isOTPDialogOpen}
                onClose={() => setIsOTPDialogOpen(false)}
                onVerify={(otp) => handleOTPVerify(otp, values)}
                email={values.email}
                resendOtp={() => resendOtp(values)}
              />
            </Form>
          )}
        </Formik>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground pb-6">
              Or Register with
            </span>
          </div>
        </div>
      </div>
      <GoogleLogin
        onSuccess={handleGoogleSignup}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}
