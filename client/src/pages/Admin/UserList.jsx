import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/config/axiosConfig"; // Import axios instance
import { toast } from "sonner";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/coustmers");
        setUsers(response.data.users); // Ensure users are fetched correctly
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array to run only once on mount

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBlockToggle = async (user) => {
    try {
      const updatedStatus = !user.is_blocked;

      await axiosInstance.patch(`/admin/coustmers/${user._id}`, {
        is_blocked: updatedStatus,
      });

      setUsers((prev) =>
        prev.map((x) =>
          x._id === user._id ? { ...x, is_blocked: updatedStatus } : x
        )
      );

      // Show a toast notification
      toast.success(`User ${updatedStatus ? "blocked" : "UnBlocked"} successfully.`);
    } catch (error) {
      console.error("Failed to update blocked status:", error);
      toast.error("Failed to update blocked status.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-6">Customer Management</h2>
        <div className="container mx-auto px-4 py-8">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 w-full max-w-sm"
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Block/Unblock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.name?.toLowerCase() || "N/A"}
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.is_blocked} // Reflect `is_blocked` state
                        onCheckedChange={() => handleBlockToggle(user)}
                        className="data-[state=unchecked]:bg-green-500 data-[state=checked]:bg-red-500"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
