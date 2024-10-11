import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axiosInstance from '../../../config/axiosConfig'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [googleData, SetGoogleData] = useState('')

  const LoginData = {
    email,
    password
  }

  const navigate = useNavigate()

  const handleGoogleLogin = async credentialResponse => {
    const credentialResponseData = jwtDecode(credentialResponse.credential)

    try {
      const response = await axiosInstance.post(
        '/users/auth/google-login',
        credentialResponseData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(response.data)
      toast('Google Login successful!')
      navigate('/landing')
    } catch (error) {
      console.error('Error logging in with Google:', error)
      toast('Error logging in with Google. Please try again.')
    }
  }

  const handlesignupnavigate = () => {
    navigate('/signup')
  }
  const handleLogin = async e => {
    e.preventDefault()
    try {
      console.log('Sending login request:', LoginData)

      const response = await axiosInstance.post('/users/login', LoginData, {
        withCredentials: true
      })

      console.log('Login response:', response)

      if (response.status === 200) {
        navigate('/landing')
        toast('Login sucess!!!')
      } else {
        console.log('Unexpected response:', response)
        alert('Failed to login.')
      }
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>cozway.com</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Log in</h2>
        </div>
        <form onSubmit={handleLogin} className='space-y-6'>
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
          <Button type='submit' className='w-full'>
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
            <span className='bg-background px-2 pb-6 text-muted-foreground'>
              Or Log in with
            </span>
          </div>
        </div>
      </div>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </div>
  )
}