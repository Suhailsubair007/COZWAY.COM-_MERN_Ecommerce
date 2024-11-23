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
import { getCroppedImg } from "../../config/cropImage";
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
    offerPrice: "",
    category: "",
    fit: "",
    sleeve: "",
    sizes: { S: "", M: "", L: "", XL: "", XXL: "" },
    images: Array(5).fill(null),
  });

  const [categories, setCategories] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const isValidName = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(text);
  };

  const isValidDescription = (text) => {
    const regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/;
    return regex.test(text);
  };

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!product.name.trim()) newErrors.name = "Name is required";
    if (!isValidName(product.name.trim()))
      newErrors.name = "Name can only contain letters and spaces";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!isValidDescription(product.description.trim()))
      newErrors.description = "Description contains invalid characters";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (
      !product.offerPrice ||
      isNaN(product.offerPrice) ||
      Number(product.offerPrice) <= 0
    ) {
      newErrors.offerPrice = "Price must be a positive number";
    }
    if (!product.category) newErrors.category = "Category is required";
    if (!product.fit) newErrors.fit = "Fit is required";
    if (!product.sleeve) newErrors.sleeve = "Sleeve is required";

    Object.entries(product.sizes).forEach(([size, stock]) => {
      if (stock && (isNaN(stock) || Number(stock) < 0)) {
        newErrors[`sizes.${size}`] = "Stock must be a non-negative number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "name") {
        if (isValidName(value)) {
          setProduct((prev) => ({ ...prev, [name]: value }));
        }
      } else if (name === "description") {
        if (isValidDescription(value)) {
          setProduct((prev) => ({ ...prev, [name]: value }));
        }
      } else {
        setProduct((prev) => ({ ...prev, [name]: value }));
      }

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const handleSizeChange = (size, value) => {
    setProduct({
      ...product,
      sizes: {
        ...product.sizes,
        [size]: value,
      },
    });

    if (errors[`sizes.${size}`]) {
      setErrors({ ...errors, [`sizes.${size}`]: null });
    }
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
      newImages[selectedImageIndex] = croppedImageBlob;

      setProduct({ ...product, images: newImages });
      setImage(null);
      setSelectedImageIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

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

    if (!validateForm()) {
      toast("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const {
      name,
      description,
      price,
      offerPrice,
      category,
      fit,
      sleeve,
      sizes,
    } = product;

    const sizeArray = Object.entries(sizes).map(([size, stock]) => ({
      size,
      stock: Number(stock) || 0,
    }));

    const imageUrls = await uploadImagesToCloudinary();
    const filteredImages = imageUrls.filter((url) => url !== null);

    if (filteredImages.length === 0) {
      toast("Error uploading images");
      setIsSubmitting(false);
      return;
    }

    const newProduct = {
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice),
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
        navigate("/admin/product");
        toast.success("Product added successfully!");
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-100">
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

            <div className="space-y-4 mt-6">
              <Input
                placeholder="Type name here..."
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                error={errors.name}
                maxLength={100}
              />

              <Textarea
                placeholder="Type description here..."
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                error={errors.description}
                maxLength={500}
              />

              <Input
                placeholder="Price of product"
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                error={errors.price}
                type="number"
                min="0"
                step="1"
              />

              <Input
                placeholder="Offer price of product"
                label="Offer Price"
                name="offerPrice"
                value={product.offerPrice}
                onChange={handleChange}
                error={errors.offerPrice}
                type="number"
                min="0"
                step="1"
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
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}

                <Select
                  onValueChange={(value) =>
                    setProduct({ ...product, fit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fit Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Fit">Regular Fit</SelectItem>
                    <SelectItem value="Slim Fit">Slim Fit</SelectItem>
                    <SelectItem value="Loose Fit">Loose Fit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fit && (
                  <p className="text-red-500 text-sm">{errors.fit}</p>
                )}

                <Select
                  onValueChange={(value) =>
                    setProduct({ ...product, sleeve: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sleeve" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Sleeve">Full Sleeve</SelectItem>
                    <SelectItem value="Half Sleeve">Half Sleeve</SelectItem>
                    <SelectItem value="Elbow Sleeve">Elbow Sleeve</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sleeve && (
                  <p className="text-red-500 text-sm">{errors.sleeve}</p>
                )}
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
                        type="number"
                        min="0"
                        step="1"
                      />
                    </div>
                  ))}
                </div>
                {Object.entries(errors)
                  .filter(([key]) => key.startsWith("sizes."))
                  .map(([key, value]) => (
                    <p key={key} className="text-red-500 text-sm">
                      {value}
                    </p>
                  ))}
              </div>
            </div>

            <Button type="submit" className="mt-6" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Add Product"}
            </Button>
          </div>
        </form>

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
