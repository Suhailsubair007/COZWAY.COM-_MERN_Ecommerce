// import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit } from "lucide-react"

// Mock data for the products
const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    description: "Comfortable and breathable cotton t-shirt for everyday wear.",
    category: "T-Shirts",
    fit: "Regular",
    sleeve: "Short",
    price: 29.99,
    totalStock: 100,
    image: "/placeholder.svg?height=120&width=180",
    isListed: true
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with a touch of stretch for comfort.",
    category: "Jeans",
    fit: "Slim",
    sleeve: "N/A",
    price: 59.99,
    totalStock: 75,
    image: "/placeholder.svg?height=120&width=180",
    isListed: false
  },
  {
    id: 3,
    name: "Casual Button-Down Shirt",
    description: "Versatile button-down shirt suitable for both casual and semi-formal occasions.",
    category: "Shirts",
    fit: "Regular",
    sleeve: "Long",
    price: 45.99,
    totalStock: 50,
    image: "/placeholder.svg?height=120&width=180",
    isListed: true
  }
]

export default function Test() {
  const handleEditProduct = (productId) => {
    console.log(`Editing product with ID: ${productId}`)
    // Add your edit logic here
  }

  const handleToggleProductListing = (productId, currentStatus) => {
    console.log(`Toggling listing for product ${productId}. Current status: ${currentStatus}`)
    // Add your toggle logic here
  }

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="h-32">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[180px] h-[120px] object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p><span className="font-semibold">Category:</span> {product.category}</p>
                    <p><span className="font-semibold">Fit:</span> {product.fit}</p>
                    <p><span className="font-semibold">Sleeve:</span> {product.sleeve}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Price:</span> ${product.price.toFixed(2)}</p>
                    <p><span className="font-semibold">Total Stock:</span> {product.totalStock}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Product
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{product.isListed ? 'Listed' : 'Unlisted'}</span>
                    <Switch
                      checked={product.isListed}
                      onCheckedChange={() => handleToggleProductListing(product.id, product.isListed)}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
