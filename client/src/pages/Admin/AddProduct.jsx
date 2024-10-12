import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Upload,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  ImageIcon,
  Ticket,
  Settings,
  LogOut
} from 'lucide-react'

export default function AddProduct () {




  const handleSubmit = ()=>{
    
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
              { icon: <ImageIcon size={20} />, label: 'Banner' },
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
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Add Product</h2>
          <p className='text-gray-500'>Dashboard &gt; product &gt; add</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Form */}
          <div className='bg-white shadow-md rounded-lg p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Image Upload Section */}
              <div className='space-y-4'>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <Upload className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-1 text-sm text-gray-600'>Browse Image</p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  {[1, 2, 3, 4].map(item => (
                    <div
                      key={item}
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'
                    >
                      <Upload className='mx-auto h-6 w-6 text-gray-400' />
                      <p className='mt-1 text-xs text-gray-600'>Browse Image</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details Section */}
              <div className='space-y-4'>
                {/* Product Name */}
                <Input placeholder='Type name here...' label='Product Name' />

                {/* Description */}
                <Textarea
                  placeholder='Type description here...'
                  label='Description'
                />

                {/* Price */}
                <Input placeholder='₹ 1399' label='Price' />
              </div>
            </div>

            {/* Category, Fit Type, Sleeve, Size, and Stock Quantity */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Select Category, Fit Type, Sleeve */}
              <div className='space-y-4'>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='casual'>Casual</SelectItem>
                    <SelectItem value='formal'>Formal</SelectItem>
                    <SelectItem value='partywear'>Party Wear</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Fit Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='regular'>Regular Fit</SelectItem>
                    <SelectItem value='slim'>Slim Fit</SelectItem>
                    <SelectItem value='loose'>Loose Fit</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Sleeve' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='full'>Full Sleeve</SelectItem>
                    <SelectItem value='half'>Half Sleeve</SelectItem>
                    <SelectItem value='sleeveless'>Sleeveless</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size and Stock Quantity */}
              <div className='space-y-4'>
                <div className='grid grid-cols-4 gap-4'>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <div key={size} className='flex items-center space-x-2'>
                      <span>{size}</span>
                      <Input placeholder='10' className='w-[60px]' />
                    </div>
                  ))}
                </div>
                <Input placeholder='Stock Quantity' label='Stock Quantity' />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-6 flex justify-end space-x-4'>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
              <Button type='submit'>Add Product</Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
