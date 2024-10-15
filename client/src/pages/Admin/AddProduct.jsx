import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from '@/config/axiosConfig'
import Cropper from 'react-easy-crop'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getCroppedImg } from '../../config/cropImage'  // Import your cropping function
import axios from 'axios'

export default function AddProduct () {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    fit: '',
    sleeve: '',
    sizes: { S: '', M: '', L: '', XL: '', XXL: '' },
    totalStock: '',
    images: Array(5).fill(null)  // Array to hold cropped images
  })

  const [categories, setCategories] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(null) // Track which image is being cropped
  const [image, setImage] = useState(null)  // Image for cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/admin/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])



  // Handle input changes for the fields
  const handleChange = e => {
    const { name, value } = e.target
    setProduct({
      ...product,
      [name]: value
    })
  }

  const handleSizeChange = (size, value) => {
    setProduct({
      ...product,
      sizes: {
        ...product.sizes,
        [size]: value
      }
    })
  }



  // Handle image file selection and cropping
  const handleImageChange = (index, event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file)) // Show the cropping UI for the selected image
      setSelectedImageIndex(index) // Track the index of the image being cropped
    }
  }



  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])



  // Handle the cropping and store the result in the images array
  const saveCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels)
      const croppedImageURL = URL.createObjectURL(croppedImageBlob)
      
      const newImages = [...product.images]
      newImages[selectedImageIndex] = croppedImageBlob // Store the cropped image blob
      
      setProduct({ ...product, images: newImages })
      setImage(null) // Reset cropping UI after saving the cropped image
      setSelectedImageIndex(null)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = product.images.map(async file => {
      if (!file) return null

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'cozway') 

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dupo7yv88/image/upload',
          formData
        )
        return response.data.secure_url
      } catch (error) {
        console.error('Error uploading image:', error)
        return null
      }
    })

    return await Promise.all(uploadPromises)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const {
      name, description, price, category, fit, sleeve, sizes, totalStock
    } = product

    const sizeArray = Object.entries(sizes).map(([size, stock]) => ({
      size,
      stock: Number(stock)
    }))

    const imageUrls = await uploadImagesToCloudinary()
    const filteredImages = imageUrls.filter(url => url !== null)

    if (filteredImages.length === 0) {
      toast('Error uploading images')
      return
    }

    const newProduct = {
      name,
      description,
      price: Number(price),
      category,
      fit,
      sleeve,
      sizes: sizeArray,
      totalStock: Number(totalStock),
      images: filteredImages 
    }

    try {
      const response = await axiosInstance.post('/admin/add_product', newProduct)
      if (response.status === 201) {
        toast('Product added successfully!')
      } else {
        toast('Failed to add product.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast('Error adding product.')
    }
  }

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
                <div key={index} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image {index + 1}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  {product.images[index] && (
                    <img
                      src={URL.createObjectURL(product.images[index])}
                      alt={`preview-${index}`}
                      className="w-20 h-20 object-cover"
                    />
                  )}
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
                        onChange={(e) =>
                          handleSizeChange(size, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Total Stock"
                  label="Total Stock Quantity"
                  name="totalStock"
                  value={product.totalStock}
                  onChange={handleChange}
                />
              </div>
            </div>
  
            <Button type="submit" className="mt-6">
              Add Product
            </Button>
          </div>
        </form>
  
        {/* Cropping Modal */}
        {image && (
          <div className="modal">
            <div className="modal-content">
              <h3>Crop Image</h3>
              <div
                className="crop-container"
                style={{
                  width: "100%",
                  height: "400px",
                  position: "relative",
                }}
              >
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
              <Button onClick={saveCroppedImage} className="mt-4">
                Save Cropped Image
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}