import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, X, CheckCircle } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";

export default function RefferalPopUp({ seen, isOpen, onClose }) {
  const [referralCode, setReferralCode] = useState("");

  const handleApplyCode = async () => {
    const responce = await axiosInstance.post("/users/refferal", {
      code: referralCode,
      seen: seen,
    });
    onClose();
  };

  const handleSkip = async () => {
    const responce = await axiosInstance.post("/users/skip");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            Enter Referral Code
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Input
              placeholder="Enter your referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="pr-10"
            />
            {referralCode && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setReferralCode("")}
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleApplyCode}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!referralCode}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Code
            </Button>
            <Button onClick={handleSkip} variant="outline" className="flex-1">
              Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
