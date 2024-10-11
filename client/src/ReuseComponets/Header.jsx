import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isSearchVisible, setSearchVisible] = useState(false)

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible)
  }

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <a href='/' className='text-xl font-bold'>
              <img src='https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png' alt='Logo' className='h-5 w-auto' />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className='hidden md:flex space-x-4'>
            <a href='/' className='text-gray-600 hover:text-gray-900'>
              Home
            </a>
            <a href='/shop' className='text-gray-600 hover:text-gray-900'>
              Shop
            </a>
            <a href='/our-story' className='text-gray-600 hover:text-gray-900'>
              Our Story
            </a>
            <a href='/contact-us' className='text-gray-600 hover:text-gray-900'>
              Contact Us
            </a>
          </nav>

          {/* Search Bar and Icons */}
          <div className='flex items-center space-x-4'>
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className='text-gray-600 hover:text-gray-900'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>

            {/* Search Input */}
            {isSearchVisible && (
              <div className='relative'>
                <Input
                  className='w-full max-w-xs'
                  type='text'
                  placeholder='Search...'
                />
              </div>
            )}

            {/* User Icon */}
            <button className='text-gray-600 hover:text-gray-900'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </button>

            {/* Login Button */}
            <Button className='bg-black text-white px-4 py-2 rounded'>
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
