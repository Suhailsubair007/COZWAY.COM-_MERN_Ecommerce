import { Switch } from '@/components/ui/switch'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axiosInstance from '../../config/axiosConfig'

const CategoryComponent = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [list, SetList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await axiosInstance.get('/admin/categories')
        console.log(categories.data)  
        SetList(categories.data)
        // console.log(list)  
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
  
    fetchCategory()
  },[]) 
  

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

      await axiosInstance.patch(`/admin/categories/${category._id}`, {
        is_active: updatedStatus
      })


      SetList(prev =>
        prev.map(cat =>
          cat._id === category._id
            ? { ...cat, is_active: updatedStatus } // Update is_active in state
            : cat
        )
      )
      console.log(`Category ${category.name} status changed to ${updatedStatus}`);
      toast(`Category ${updatedStatus ? 'listed' : 'unlisted'} successfully!`)
    } catch (error) {
      toast('Failed to update category status.')
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Main Content */}
      <main className='flex-1 overflow-y-auto p-4'>
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
                rows={6}
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
                <th className='py-2 px-4 text-left'>Category Name</th>
                <th className='py-2 px-4 text-left'>Category Description</th>
                <th className='py-2 px-4 text-left'>List/Unlist</th>
                <th className='py-2 px-4 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(category => (
                <tr key={category._id}>
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
