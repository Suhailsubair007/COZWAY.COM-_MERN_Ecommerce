import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletPopup from "@/ReuseComponets/User/WalletPopup";

export default function UserWallet() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [balance, SetBalance] = useState(null);
  const [amount, setAmount] = useState(0);
  const user = useSelector((state) => state.user.userInfo);
  const userId = user.id;

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await axiosInstance.get("/users/wallet", {
        params: { userId },
      });
      setTransactions(response.data.wallet.transactions);
      SetBalance(response.data.wallet.balance);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const handleAddFunds = async () => {
    try {
      const response = await axiosInstance.post("/users/wallet", {
        userId,
        amount: Number(amount),
      });
      toast.success(response.data.message);
      setTransactions(response.data.wallet.transactions);
      SetBalance(response.data.wallet.balance);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding funds:", error);
      toast.error("Failed to add funds.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Wallet</h1>
            <p className="text-sm text-gray-600">Manage your wallet</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome!</p>
            <p className="font-medium text-gray-900">{user.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            My Wallet
          </h2>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                <h3 className="text-3xl md:text-4xl font-bold">
                  {balance?.toFixed(0)}
                </h3>
              </div>
              <Button
                onClick={() => setIsPopupOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <div
                className="max-h-[300px] overflow-y-scroll scrollbar-hidden"
                style={{ scrollbarWidth: "none" }}
              >
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const Icon =
                        transaction.transaction_type === "credit"
                          ? ArrowUpRight
                          : ArrowDownLeft;
                      const statusColor =
                        transaction.transaction_type === "credit"
                          ? "text-green-500"
                          : "text-red-500";

                      return (
                        <tr
                          key={transaction._id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  transaction.transaction_type === "credit"
                                    ? "bg-green-100"
                                    : "bg-red-100"
                                }`}
                              >
                                <Icon className={`w-4 h-4 ${statusColor}`} />
                              </div>
                              <span className="font-medium capitalize text-gray-800">
                                {transaction.transaction_type}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            ₹{transaction.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(
                              transaction.transaction_date
                            ).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`flex items-center gap-2 ${
                                transaction.transaction_status.toLowerCase() ===
                                "pending"
                                  ? "text-orange-500"
                                  : statusColor
                              }`}
                            >
                              {transaction.transaction_status.toLowerCase() ===
                                "pending" && (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              )}
                              {transaction.transaction_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <WalletPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <p className="text-gray-700">
            Enter the amount to add to your wallet.
          </p>
          <input
            type="number"
            placeholder="Amount"
            className="mt-4 w-full p-2 border rounded-lg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // Set the amount
          />
          <Button
            className="mt-4 w-full bg-primary hover:bg-primary/90"
            onClick={handleAddFunds}
          >
            Add Funds
          </Button>
        </WalletPopup>
      </div>
    </div>
  );
}
