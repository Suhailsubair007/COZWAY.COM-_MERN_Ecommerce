import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X, Upload, Save } from "lucide-react";

const EditProduct = () => {
  const { productId } = useParams();
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin/product/edit/${productId}`);
        const productData = response.data;
        setProduct({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price ? productData.price.toString() : "",
          category: productData.category.name || "",
          fit: productData.fit || "",
          sleeve: productData.sleeve || "",
          sizes: productData.sizes.reduce(
            (acc, size) => {
              acc[size.size] = size.stock.toString();
              return acc;
            },
            { S: "", M: "", L: "", XL: "", XXL: "" }
          ),
          images: productData.images || Array(5).fill(""),
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast("Failed to load product details");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast("Failed to load categories");
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSizeChange = (size, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: {
        ...prevProduct.sizes,
        [size]: value,
      },
    }));
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

      setProduct((prevProduct) => {
        const newImages = [...prevProduct.images];
        newImages[selectedImageIndex] = croppedImageBlob;
        return { ...prevProduct, images: newImages };
      });

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

    const updatedProduct = {
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
      const response = await axiosInstance.put(
        `/admin/update_product/${productId}`,
        updatedProduct
      );
      if (response.status === 200) {
        toast("Product updated successfully!");
      } else {
        toast("Failed to update product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Error updating product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Edit Product</CardTitle>
          <p className="text-muted-foreground">Dashboard &gt; product &gt; edit</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`image-${index}`} className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById(`image-${index}`).click()}
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

            <div className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      category: value,
                    }))
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
                  value={product.fit}
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      fit: value,
                    }))
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
                  value={product.sleeve}
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      sleeve: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sleeve" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="half">Half Sleeve</SelectItem>
                    <SelectItem value="full">Full Sleeve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {Object.entries(product.sizes).map(([size, stock]) => (
                  <Input
                    key={size}
                    placeholder={`${size} (size)`}
                    label={size}
                    name={`sizes.${size}`}
                    value={stock}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Update Product
            </Button>
          </form>
        </CardContent>
      </Card>

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
                  aspect={2 /3}
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
    </div>
  );
};

export default EditProduct;