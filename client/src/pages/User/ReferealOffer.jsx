import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, CheckCircle, Shirt } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";


export default function ReferralCode() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setRefferalCode] = useState("");
  const referralBonus = 200;
  const quote = "Dress to impress, refer with finesse.";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchRefferalCode = async () => {
      try {
        const responce = await axiosInstance.get(`/users/refferalCode`);
        setRefferalCode(responce.data.referralCode);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRefferalCode();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Shirt className="w-8 h-8" />
            Your Referral Code
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg text-center">
            <p className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {referralCode}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-lg px-6 py-3"
              variant={copied ? "outline" : "default"}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <div className="text-center text-lg text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-green-500" />
              Referral Bonus: ₹{referralBonus}
            </p>
          </div>
          <div className="text-center italic text-xl text-gray-700 dark:text-gray-300">
            "{quote}"
          </div>
        </div>
      </div>
    </div>
  );
}
