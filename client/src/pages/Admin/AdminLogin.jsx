import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = e => {
    e.preventDefault()
    // Handle login logic here
  }

  const handlesignupnavigate = () => {
    navigate('admin/dashboard')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <div className='w-full max-w-md space-y-8'>

        <div className='text-center'>
          <h1 className='text-2xl font-bold'>cozway.com</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Log in</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className='space-y-6'>
          {/* Email Input */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='helloworld@gmail.com'
              required
            />
          </div>

          {/* Password Input */}
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Password'
                required
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className='h-4 w-4 text-gray-400' />
                ) : (
                  <EyeIcon className='h-4 w-4 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          {/* Log in Button */}
          <Button type='submit' className='w-full' onClick={handlesignupnavigate}>
            Log in
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
