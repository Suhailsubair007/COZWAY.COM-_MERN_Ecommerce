import React from 'react'
import Header from '@/ReuseComponets/User/Header'
import Footer from '@/ReuseComponets/User/Footer'
import OrderDetail from '@/ReuseComponets/User/orderDetailPage'

const Order_details = () => {
  return (
    <div>
        <Header/>
        <OrderDetail/>
        <Footer/>
    </div>
  )
}

export default Order_details