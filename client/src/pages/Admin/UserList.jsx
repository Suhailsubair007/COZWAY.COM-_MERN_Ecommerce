import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import { logoutUser } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";
import { Home, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, UserX, UserCheck } from "lucide-react";

export default function Component() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/coustmers");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers.");
      }
    };

    fetchCustomers();
  }, []);

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

      dispatch(logoutUser());
      localStorage.removeItem("userInfo");
      toast.success(
        `User ${updatedStatus ? "blocked" : "unblocked"} successfully.`
      );
    } catch (error) {
      console.error("Failed to update blocked status:", error);
      toast.error("Failed to update blocked status.");
    }
  };

  return (
    <div className="mt-10 pl-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Offer Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="min-h-screen bg-gray-100 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Customer Management
            </CardTitle>
            <Users className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.name?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Switch
                              checked={user.is_blocked}
                              className={`w-12 h-6 rounded-full ${
                                user.is_blocked ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Action
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to{" "}
                                {user.is_blocked ? "unblock" : "block"} this
                                user?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleBlockToggle(user)}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {user.is_blocked ? (
                          <UserX className="inline-block ml-2 h-4 w-4 text-red-500" />
                        ) : (
                          <UserCheck className="inline-block ml-2 h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
