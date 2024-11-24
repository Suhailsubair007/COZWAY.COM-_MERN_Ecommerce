import { ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NoOrdersFallback() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-[360px] px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by placing your first order!</p>
        <div className="mt-6">
          <Button onClick={() => navigate('/shop')} className="inline-flex items-center px-4 py-2">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}

