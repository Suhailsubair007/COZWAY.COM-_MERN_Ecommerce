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
    navigate('/admin/product/add')
  }

  return (
    <div className='flex h-screen bg-gray-100'>
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
