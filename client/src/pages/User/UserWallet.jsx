import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";
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
                <h3 className="text-3xl md:text-4xl font-bold">{balance}</h3>
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

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
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
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-full ${
                                transaction.transaction_type === "credit"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${statusColor}`} />
                            </div>
                            <span className="font-medium">
                              {transaction.transaction_type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {transaction.amount}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(
                            transaction.transaction_date
                          ).toLocaleString("en-US")}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`flex items-center gap-1 ${
                              transaction.transaction_status === "Pending"
                                ? "text-orange-500"
                                : statusColor
                            }`}
                          >
                            {transaction.transaction_status === "pending" && (
                              <RefreshCw className="w-3 h-3 animate-spin" />
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
