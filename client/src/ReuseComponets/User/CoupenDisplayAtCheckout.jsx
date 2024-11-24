import React, { useEffect, useState } from 'react'
import { Copy, Check, Ticket } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axiosInstance from '@/config/axiosConfig'

export const CouponDisplayAtCheckout = () => {
    const [copiedStates, setCopiedStates] = useState({})
    const [coupons, setCoupons] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get("/users/coupons")
            setCoupons(response.data.coupens)
        } catch (error) {
            console.error("Error fetching coupons:", error)
            setError("Failed to load coupons. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
        setCopiedStates(prev => ({ ...prev, [code]: true }))
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [code]: false }))
        }, 2000)
    }

    if (isLoading) return <div className="text-muted-foreground animate-pulse">Loading coupons...</div>
    if (error) return null
    if (!coupons.length) return null

    return (
        <div className="space-y-3 w-full max-w-2xl mx-auto">
            {coupons.map((coupon) => (
                <Card
                    key={coupon._id}
                    className="bg-background border-2 hover:border-primary transition-colors duration-200 rounded-lg p-4"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-primary" />
                            <span className="font-semibold tracking-tight">
                                {coupon.code}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                Save ₹{coupon.discount_amount}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(coupon.code)}
                                className="ml-auto sm:ml-0"
                            >
                                {copiedStates[coupon.code] ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default CouponDisplayAtCheckout

