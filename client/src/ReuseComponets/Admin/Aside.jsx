import { NavLink } from 'react-router-dom'
// import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  ImageIcon,
  Ticket,
  Settings,
  LogOut
} from 'lucide-react'

const Aside = () => {
  return (
    <div>
      <aside className='w-64 bg-white shadow-md'>
        <div className='pl-10 p-4 border-b'>
          <img
            src='https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png'
            alt='Logo'
            className='w-32 h-auto'
          />
        </div>

        <nav className='p-4'>
          <ul className='space-y-2'>
            {[
              { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
              { path: '/admin/categories', icon: <Layers size={20} />, label: 'Category' },
              { path: '/admin/product', icon: <ShoppingBag size={20} />, label: 'Products' },
              { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
              { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
              { path: '/admin/banner', icon: <ImageIcon size={20} />, label: 'Banner' },
              { path: '/admin/coupons', icon: <Ticket size={20} />, label: 'Coupon' },
              { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
              { path: '/admin/logout', icon: <LogOut size={20} />, label: 'Logout' }
            ].map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-start p-2 rounded-lg 
                    ${isActive ? 'bg-gray-200 text-black' : 'text-gray-600'}`
                  }
                >
                  {item.icon}
                  <span className='ml-2'>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}

export default Aside
