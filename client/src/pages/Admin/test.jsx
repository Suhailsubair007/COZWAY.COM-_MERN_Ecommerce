import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/config/axiosConfig";
import Cropper from "react-easy-crop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCroppedImg } from "../../config/cropImage"; // Import your cropping function
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X, Upload, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    fit: "",
    sleeve: "",
    sizes: { S: "", M: "", L: "", XL: "", XXL: "" },
    images: Array(5).fill(null),
  });

  const [categories, setCategories] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Track which image is being cropped
  const [image, setImage] = useState(null); // Image for cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };


  const handleSizeChange = (size, value) => {
    setProduct({
      ...product,
      sizes: {
        ...product.sizes,
        [size]: value,
      },
    });
  };


  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
      setSelectedImageIndex(index);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);



  const saveCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      const croppedImageURL = URL.createObjectURL(croppedImageBlob);

      const newImages = [...product.images];
      newImages[selectedImageIndex] = croppedImageBlob; // Store the cropped image blob

      setProduct({ ...product, images: newImages });
      setImage(null);
      setSelectedImageIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };


  //functio to uplaod image to cloudinary..

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = product.images.map(async (file) => {
      if (!file) return null;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cozway");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dupo7yv88/image/upload",
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    });

    return await Promise.all(uploadPromises);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, category, fit, sleeve, sizes } = product;

    const sizeArray = Object.entries(sizes).map(([size, stock]) => ({
      size,
      stock: Number(stock),
    }));

    const imageUrls = await uploadImagesToCloudinary();
    const filteredImages = imageUrls.filter((url) => url !== null);

    if (filteredImages.length === 0) {
      toast("Error uploading images");
      return;
    }

    const newProduct = {
      name,
      description,
      price: Number(price),
      category,
      fit,
      sleeve,
      sizes: sizeArray,
      images: filteredImages,
    };

    try {
      const response = await axiosInstance.post(
        "/admin/add_product",
        newProduct
      );
      if (response.status === 201) {
        navigate('/admin/product')
        toast("Product added successfully!");
      } else {
        toast("Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Error adding product.");
    }
  };

  
  return (
    <div className=" flex bg-gray-100">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Add Product</h2>
          <p className="text-gray-500">Dashboard &gt; product &gt; add</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Label
                    htmlFor={`image-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Image {index + 1}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        document.getElementById(`image-${index}`).click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id={`image-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      className="hidden"
                    />
                    {product.images[index] && (
                      <img
                        src={
                          typeof product.images[index] === "string"
                            ? product.images[index]
                            : URL.createObjectURL(product.images[index])
                        }
                        alt={`preview-${index}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Product Details Section */}
            <div className="space-y-4 mt-6">
              <Input
                placeholder="Type name here..."
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
              />

              <Textarea
                placeholder="Type description here..."
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
              />

              <Input
                placeholder="₹ 1399"
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select
                  onValueChange={(value) =>
                    setProduct({ ...product, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setProduct({ ...product, fit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fit Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Fit</SelectItem>
                    <SelectItem value="slim">Slim Fit</SelectItem>
                    <SelectItem value="loose">Loose Fit</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setProduct({ ...product, sleeve: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sleeve" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Sleeve</SelectItem>
                    <SelectItem value="half">Half Sleeve</SelectItem>
                    <SelectItem value="sleeveless">Elbow Sleeve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <span>{size}</span>
                      <Input
                        placeholder="10"
                        value={product.sizes[size]}
                        onChange={(e) => handleSizeChange(size, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="mt-6">
              Add Product
            </Button>
          </div>
        </form>

        {/* Cropping Modal */}
        {image && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Crop Image</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative">
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={2 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="zoom">Zoom</Label>
                  <Slider
                    id="zoom"
                    min={1}
                    max={3}
                    step={0.1}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                  />
                </div>
                <Button onClick={saveCroppedImage} className="mt-4 w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Cropped Image
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
