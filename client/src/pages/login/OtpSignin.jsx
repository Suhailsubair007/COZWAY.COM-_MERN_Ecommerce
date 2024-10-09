"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Otpsignin() {
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [timer, setTimer] = useState(20)
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  const handleChange = (element, event) => {
    if (isNaN(Number(event.target.value))) return false

    setOtp([...otp.map((d, idx) => (idx === element ? event.target.value : d))])

    if (event.target.nextSibling && event.target.value !== "") {
      event.target.nextSibling.focus()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-6">
          We've sent an email with an activation code to your phone test@gmail.com
        </p>
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((data, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-xl"
              value={data}
              onChange={(e) => handleChange(index, e)}
            />
          ))}
        </div>
        <div className="text-center mb-4">
          <Button variant="link" disabled={isResendDisabled} className="text-sm text-gray-600">
            Send code again {timer > 0 && `00:${timer.toString().padStart(2, "0")}`}
          </Button>
        </div>
        <div className="text-center mb-6">
          <span className="text-sm text-gray-600">I didn't receive a code. </span>
          <Button variant="link" disabled={isResendDisabled} className="text-sm p-0">
            Resend
          </Button>
        </div>
        <Button className="w-full bg-black text-white hover:bg-gray-800">Verify</Button>
      </div>
    </div>
  )
}
