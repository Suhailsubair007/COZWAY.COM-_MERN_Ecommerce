import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-white to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin dark:border-gray-700 dark:border-t-gray-300"></div>
        </div>
        <Loader2 className="w-16 h-16 text-gray-500 animate-pulse dark:text-gray-300" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse dark:text-gray-300">Loading...</p>
    </div>
  )
}

