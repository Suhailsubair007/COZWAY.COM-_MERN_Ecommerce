import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axiosInstance from '../../config/axiosConfig'


const EditCategory = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()
  const { categoryId } = useParams() // Assumes categoryId is passed via route params

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/categories/edit/${categoryId}` // Pass categoryId in the URL
        )
        console.log(response.data)
        const category = response.data
        setName(category.name)
        setDescription(category.description)
      } catch (error) {
        toast('Failed to fetch category details.')
        console.error(error)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const handleUpdateCategory = async e => {
    e.preventDefault()

    try {
      // Gather the updated category data
      const updatedCategory = {
        name,
        description
      }

      // Send a PUT request to update the category
      const response = await axiosInstance.put(
        `/admin/edit-category/${categoryId}`, 
        updatedCategory
      )

      if (response.status === 200) {
        toast('Category updated successfully.')

        // Navigate to the categories page
        navigate('/admin/categories')
      } else {
        toast('Failed to update category. Please try again.')
      }
    } catch (error) {
      toast('Error updating category.')
      console.error('Update error:', error)
    }
  }
  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100'>

      <main className='flex-1 p-6'>
        <h2 className='text-xl font-semibold mb-6'>Edit Category</h2>
        <div className='mb-10'>
          <form
            onSubmit={handleUpdateCategory}
            className='bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4'
          >
            <div className='w-full'>
              <label className='block mb-2 text-sm font-semibold'>
                Category Name:
              </label>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Enter Category Name'
                className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-semibold'>
                Category Description:
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Enter Category Description'
                className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows='6'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full lg:w-32 bg-black hover:bg-gray-600 text-white py-2 px-4 rounded-lg mt-4 text-sm self-end'
            >
              Update Category
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditCategory
