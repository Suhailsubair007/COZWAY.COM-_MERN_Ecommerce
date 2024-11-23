import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPVerification } from "./OTPVerification";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (values, { setSubmitting }) => {
    const { email } = values;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/reset", { email });
      console.log(response.data);

      if (response.status === 200) {
        setIsOTPDialogOpen(true);
        toast("OTP sent to your email.");
      } else {
        toast("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast("Error sending OTP. Please try again later.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleOTPVerify = async (otp, email) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/verify", { email, otp });
      console.log(response.data);

      if (response.status === 200) {
        navigate("/reset-password", { state: { email } });
        toast("OTP verified. Please reset your password.");
      } else {
        toast("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/send-otp", { email });
      console.log(response.data);
      if (response.status === 200) {
        toast("OTP resent to your email.");
      } else {
        toast("Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast("Error resending OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">cozway.com</h1>
          <h2 className="text-3xl font-bold mt-6 mb-2">Forgot Password</h2>
          <p className="text-muted-foreground mb-6">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSendOTP}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>

              <OTPVerification
                isOpen={isOTPDialogOpen}
                onClose={() => setIsOTPDialogOpen(false)}
                onVerify={(otp) => handleOTPVerify(otp, values.email)}
                email={values.email}
                resendOtp={() => resendOtp(values.email)}
              />
            </Form>
          )}
        </Formik>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}