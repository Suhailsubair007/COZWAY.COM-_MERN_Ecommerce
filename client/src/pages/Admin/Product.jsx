// import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import shirtImg from '../../assets/image/shiert.webp'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  Image,
  Ticket,
  Settings,
  LogOut,
  Pencil,
  Trash2,
  ChevronRight
} from 'lucide-react'

const products = [
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  },
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  },
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  },
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  },
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  },
  {
    id: '#534726',
    name: 'H&M Hoodies Black',
    qty: 32,
    price: 'INR 1699.00',
    category: 'Sweat Shirts'
  }
]

export default function ProductManagement () {
  const navigate = useNavigate()

  const handleProductNavigate = () => {
    navigate('/admin/dashboard/product/addproduct')
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-white shadow-md'>
        <div className='pl-10 p-4 border-b'>
          <img
            src='https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png'
            alt=''
            className='w-32 h-auto'
          />
        </div>
        <nav className='p-4'>
          <ul className='space-y-2'>
            {[
              { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
              { icon: <Layers size={20} />, label: 'Category' },
              { icon: <ShoppingBag size={20} />, label: 'Products' },
              { icon: <Users size={20} />, label: 'Customers' },
              { icon: <ShoppingCart size={20} />, label: 'Orders' },
              { icon: <Image size={20} />, label: 'Banner' },
              { icon: <Ticket size={20} />, label: 'Coupon' },
              { icon: <Settings size={20} />, label: 'Settings' },
              { icon: <LogOut size={20} />, label: 'Logout' }
            ].map((item, index) => (
              <li key={index}>
                <Button variant='ghost' className='w-full justify-start'>
                  {item.icon}
                  <span className='ml-2'>{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold'>Product Management</h2>
            <p className='text-gray-500'>Dashboard &gt; Product Management</p>
          </div>
          <div className='w-1/3'>
            <Input type='search' placeholder='Search...' className='w-full' />
          </div>
        </div>

        {/* Product Table */}
        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center'>
                      <img
                        src={shirtImg}
                        alt={product.name}
                        className='w-10 h-10 rounded-full mr-3'
                      />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Button variant='ghost' size='icon'>
                        <Pencil size={16} />
                      </Button>
                      <Button variant='ghost' size='icon'>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination and Add Product */}
        <div className='mt-4 flex justify-between items-center'>
          <div className='flex space-x-2'>
            <Button variant='outline'>1</Button>
            <Button variant='outline'>2</Button>
            <Button variant='outline'>3</Button>
            <Button variant='outline'>
              <ChevronRight size={16} />
            </Button>
          </div>
          <Button onClick={handleProductNavigate}>+ Add Product</Button>
        </div>
      </main>
    </div>
  )
}
