import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axiosInstance from '../../config/axiosConfig'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const LoginData = {
    email,
    password
  }

  const navigate = useNavigate()

  const handlesignupnavigate = () => {
    navigate('/signup')
  }
  const handleLogin = async () => {
    try {
      const responce = await axiosInstance.post('/users/login', LoginData, {
        withCredentials: true
      })
      console.log(responce)

      if (responce.status === 200) {
        navigate('/landing')
        toast('OTP resent to your email.')
      } else {
        alert('Failed to resend OTP.')
      }
      console.log(responce.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <Toaster position='top-center' />
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>cozway.com</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Log in</h2>
        </div>
        <form className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
            <Input
              id='email'
              type='email'
              onChange={e => setEmail(e.target.value)}
              placeholder='helloworld@gmail.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
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
          <div className='flex justify-end'>
            <a
              href='#'
              className='text-sm font-medium text-primary hover:underline'
            >
              Forgot password?
            </a>
          </div>
          <Button onClick={handleLogin} type='submit' className='w-full'>
            Log in
          </Button>
        </form>
        <div className='text-sm text-center'>
          New user?{' '}
          <a
            onClick={handlesignupnavigate}
            href=''
            className='font-medium text-primary hover:underline'
          >
            Sign up
          </a>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or Log in with
            </span>
          </div>
        </div>
        <Button variant='outline' className='w-full'>
          <svg
            className='mr-2 h-4 w-4'
            aria-hidden='true'
            focusable='false'
            data-prefix='fab'
            data-icon='google'
            role='img'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 488 512'
          >
            <path
              fill='currentColor'
              d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
            ></path>
          </svg>
          Google
        </Button>
      </div>
    </div>
  )
}
