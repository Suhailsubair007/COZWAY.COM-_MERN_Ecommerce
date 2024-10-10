import { useState, useEffect } from 'react'
import axiosInstance from '../../config/axiosConfig'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { OTPVerification } from '../OTP/OTPVerification'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function SignUp () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleSignupData, setGoogleSignupData] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      if (googleSignupData) {
        try {
          const response = await axiosInstance.post(
            '/users/auth/google-signup',
            googleSignupData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          console.log(response.data)
        } catch (error) {
          console.error('Error signing in with Google:', error)
        }
      }
    }

    fetchUser()
  }, [googleSignupData])

  const handleSignUp = async e => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const signUpData = {
      name,
      email,
      phone,
      password
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post('/users/send-otp', signUpData)
      console.log(response.data)
      if (response.status === 200) {
        setIsOTPDialogOpen(true)
        toast('OTP sent to your email.')
      } else {
        alert('Failed to send OTP.')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast('Error sending OTP. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async otp => {
    const signUpWithOtpData = {
      name,
      email,
      phone,
      password,
      otp
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post(
        '/users/signup',
        signUpWithOtpData,
        {
          withCredentials: true
        }
      )
      console.log(response.data)

      if (response.status === 201) {
        navigate('/login')
        toast('Signup successful! Please log in.')
      } else {
        alert('Invalid OTP or failed to signup.')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast('Error verifying OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    const signUpData = {
      name,
      email,
      phone,
      password
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post('/users/send-otp', signUpData, {
        withCredentials: true
      })
      if (response.status === 200) {
        toast('OTP resent to your email.')
      } else {
        alert('Failed to resend OTP.')
      }
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast('Error resending OTP. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleloginnavigate = () => {
    navigate('/login')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <Toaster position='top-center' />
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>cozway.com</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Sign up</h2>
        </div>
        <form className='space-y-4' onSubmit={handleSignUp}>
          <div className='space-y-1'>
            <Label htmlFor='fullName'>Full name</Label>
            <Input
              id='fullName'
              placeholder='Full name'
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)} // Set the email state
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='mobileNumber'>Mobile Number</Label>
            <Input
              id='phone'
              type='tel'
              placeholder='Mobile Number'
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
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
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm password'
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className='h-4 w-4 text-gray-400' />
                ) : (
                  <EyeIcon className='h-4 w-4 text-gray-400' />
                )}
              </button>
            </div>
          </div>
          <div className='text-sm text-center'>
            Already have an account?{' '}
            <a
              onClick={handleloginnavigate}
              href='#'
              className='font-medium text-primary hover:underline'
            >
              Log in
            </a>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Sending OTP...' : 'Sign Up'}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground pb-6'>
              Or Register with
            </span>
          </div>
        </div>
      </div>
      <GoogleLogin
        onSuccess={credentialResponse => {
          const credentialResponseData = jwtDecode(
            credentialResponse.credential
          )

          console.log(credentialResponseData)
          setGoogleSignupData(credentialResponseData)
        }}
        onError={() => {
          console.log('Login Failed')
        }}
      />
      <OTPVerification
        isOpen={isOTPDialogOpen}
        onClose={() => setIsOTPDialogOpen(false)}
        onVerify={handleOTPVerify}
        email={email} // Pass the email to the OTPVerification component
        resendOtp={resendOtp} // Pass the resendOtp function
      />
    </div>
  )
}
