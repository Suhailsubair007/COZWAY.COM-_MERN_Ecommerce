import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Import, PlusCircle, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [newBanner, setNewBanner] = useState({
    image: null,
    heading: "",
    subHeading: "",
    description: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get("/admin/banner");
      setBanners(response.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setNewBanner({ ...newBanner, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewBanner({ ...newBanner, image: file });
  };

  const uploadImageToCloudinary = async () => {
    if (!newBanner.image) return null;

    const formData = new FormData();
    formData.append("file", newBanner.image);
    formData.append("upload_preset", "cozway");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dupo7yv88/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      const bannerData = {
        ...newBanner,
        image: imageUrl,
      };
      await axiosInstance.post("/admin/banner", bannerData);
      setIsModalOpen(false);
      fetchBanners();
      setNewBanner({
        image: null,
        heading: "",
        subHeading: "",
        description: "",
      });
      toast.success("Banner added successfully.");
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Failed to add banner. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/admin/banner/${bannerToDelete._id}`);
      fetchBanners();
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
      toast.success("Banner deleted successfully.");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast("Failed to delete banner. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-screen overflow-y-auto p-4">
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
            <BreadcrumbPage>Bannner Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add New Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <Input
                  type="text"
                  name="heading"
                  placeholder="Heading"
                  value={newBanner.heading}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="subHeading"
                  placeholder="Sub Heading"
                  value={newBanner.subHeading}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={newBanner.description}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Add Banner"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.length > 0 &&
            banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={banner.image}
                    alt={banner.heading}
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {banner.heading}
                  </h2>
                  <h3 className="text-lg text-gray-600 mb-2">
                    {banner.subHeading}
                  </h3>
                  <p className="text-gray-500">{banner.description}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleDeleteClick(banner)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Banner
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this banner? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
