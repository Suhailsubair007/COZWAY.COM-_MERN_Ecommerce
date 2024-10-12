import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axiosInstance from '../../config/axiosConfig'

import {
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

const CategoryComponent = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [list, SetList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategory = async () => {
      const categories = await axiosInstance.get('/admin/categories')
      SetList(categories.data)
      console.log(SetList)
    }

    fetchCategory()
  }, [])

  const handleAddCategory = async e => {
    e.preventDefault()

    try {
      const response = await axiosInstance.post('/admin/add_category', {
        name,
        description
      })
      console.log(response)

      if (response.status === 201) {
        toast('Category added successfully!')

        setName('')
        setDescription('')
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast('Category with this name already exists.')
      } else {
        toast('An error occurred. Please try again.')
      }
    }
  }

  const toggleCategoryStatus = async category => {
    try {
      const updatedStatus = !category.is_active

      // Send the update request to backend
      await axiosInstance.patch(`/admin/categories/${category._id}`, {
        is_active: updatedStatus
      })

      // Update the local state to reflect the change in UI
      SetList(prev =>
        prev.map(cat =>
          cat._id === category._id
            ? { ...cat, is_active: updatedStatus } // Update is_active in state
            : cat
        )
      )

      toast(`Category ${updatedStatus ? 'listed' : 'unlisted'} successfully!`)
    } catch (error) {
      toast('Failed to update category status.')
    }
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-white shadow-md'>
        <div className='pl-10 p-4 border-b'>
          <img
            src='https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png'
            alt='Logo'
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
      <main className='flex-1 p-6'>
        <h2 className='text-xl font-semibold mb-6'>Add Category</h2>

        {/* Form */}
        <div className='mb-10'>
          <form
            onSubmit={handleAddCategory}
            className='bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4'
          >
            <div className='w-full'>
              <label className='block mb-2 text-sm font-semibold'>
                Category Name:
              </label>
              <input
                type='text'
                value={name} // Bind input to state
                onChange={e => setName(e.target.value)}
                placeholder='Enter Category Name'
                className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required // Optional: Make the field required
              />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-semibold'>
                Category Description:
              </label>
              <textarea
                value={description} // Bind textarea to state
                onChange={e => setDescription(e.target.value)}
                placeholder='Enter Category Description'
                className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows='6'
                required // Optional: Make the field required
              />
            </div>
            <button
              type='submit'
              className='w-full lg:w-32 bg-black hover:bg-gray-600 text-white py-2 px-4 rounded-lg mt-4 text-sm self-end'
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Category Table */}
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <table className='min-w-full bg-white'>
            <thead>
              <tr>
                <th className='py-2 px-4 text-left'>ID</th>
                <th className='py-2 px-4 text-left'>Category Name</th>
                <th className='py-2 px-4 text-left'>Category Description</th>
                <th className='py-2 px-4 text-left'>List/Unlist</th>
                <th className='py-2 px-4 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(category => (
                <tr key={category._id}>
                  <td className='border-t py-2 px-4'>{category._id}</td>
                  <td className='border-t py-2 px-4'>{category.name}</td>
                  <td className='border-t py-2 px-4'>{category.description}</td>
                  <td className='border-t py-2 px-4'>
                    <Switch
                      checked={category.is_active} // Properly bind the switch to is_active state
                      onCheckedChange={() => toggleCategoryStatus(category)} // Call the toggle function
                    />
                  </td>
                  <td className='border-t py-2 px-4'>
                    <button
                      onClick={() =>
                        navigate(`/admin/categories/edit/${category._id}`)
                      }
                      className='bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded-lg text-sm'
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default CategoryComponent
